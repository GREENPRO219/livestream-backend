#!/bin/bash

# Livestream Backend Deployment Script for Aliyun
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
APP_NAME="livestream-backend"
APP_DIR="/app/$APP_NAME"
BACKUP_DIR="/app/backups"
LOG_DIR="/app/logs"

echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Create necessary directories
print_status "Creating directories..."
sudo mkdir -p $APP_DIR
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p $LOG_DIR
sudo mkdir -p /app/uploads

# Set proper permissions
sudo chown -R $USER:$USER $APP_DIR
sudo chown -R www-data:www-data /app/uploads
sudo chmod 755 /app/uploads

# Backup current version if exists
if [ -d "$APP_DIR/dist" ]; then
    print_status "Creating backup of current version..."
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    sudo cp -r $APP_DIR $BACKUP_DIR/$BACKUP_NAME
    print_status "Backup created: $BACKUP_DIR/$BACKUP_NAME"
fi

# Stop the application if running
print_status "Stopping application..."
pm2 stop $APP_NAME 2>/dev/null || print_warning "Application not running"

# Navigate to app directory
cd $APP_DIR

# Pull latest code (if using git)
if [ -d ".git" ]; then
    print_status "Pulling latest code..."
    git pull origin main
else
    print_warning "Git repository not found. Please ensure code is up to date."
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci --only=production

# Build the application
print_status "Building application..."
npm run build:prod

# Copy environment file
if [ -f ".env.$ENVIRONMENT" ]; then
    print_status "Copying environment configuration..."
    cp .env.$ENVIRONMENT .env
else
    print_warning "Environment file .env.$ENVIRONMENT not found. Please ensure .env is configured."
fi

# Run database migrations
print_status "Running database migrations..."
npm run migration:run

# Start the application
print_status "Starting application..."
pm2 start ecosystem.config.js --env $ENVIRONMENT

# Save PM2 configuration
pm2 save

# Check application status
print_status "Checking application status..."
sleep 5
pm2 status

# Test application health
print_status "Testing application health..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_status "✅ Application is healthy!"
else
    print_warning "⚠️  Health check failed. Check logs with: pm2 logs $APP_NAME"
fi

# Cleanup old backups (keep last 5)
print_status "Cleaning up old backups..."
cd $BACKUP_DIR
ls -t | tail -n +6 | xargs -r sudo rm -rf

print_status "🎉 Deployment completed successfully!"
print_status "Application logs: pm2 logs $APP_NAME"
print_status "Application status: pm2 status"
print_status "Nginx status: sudo systemctl status nginx" 