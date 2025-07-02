# Deploying Livestream Backend to Aliyun

This guide will help you deploy your NestJS livestream backend application to Aliyun Cloud Platform.

## Prerequisites

1. Aliyun account with access to:
   - ECS (Elastic Compute Service)
   - RDS (Relational Database Service) for PostgreSQL
   - Redis instance
   - OSS (Object Storage Service) for file uploads
   - SLB (Server Load Balancer) - optional for load balancing

2. Domain name (optional but recommended)

## Step 1: Set Up Infrastructure

### 1.1 Create ECS Instance

1. Log into Aliyun Console
2. Navigate to ECS (Elastic Compute Service)
3. Create a new ECS instance:
   - **Instance Type**: Choose based on your needs (recommended: 2 vCPU, 4GB RAM minimum)
   - **Operating System**: Ubuntu 20.04 LTS or CentOS 8
   - **Network**: VPC with public IP
   - **Security Group**: Configure to allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), and your app port (default 5000)

### 1.2 Set Up RDS PostgreSQL Database

1. Navigate to RDS (Relational Database Service)
2. Create a new PostgreSQL instance:
   - **Engine**: PostgreSQL 13 or higher
   - **Instance Type**: Choose based on your needs
   - **Storage**: At least 20GB
   - **Network**: Same VPC as your ECS instance
   - **Security**: Configure security group to allow connections from ECS

### 1.3 Set Up Redis Instance

1. Navigate to Redis (ApsaraDB for Redis)
2. Create a new Redis instance:
   - **Engine**: Redis 6.0 or higher
   - **Instance Type**: Choose based on your needs
   - **Network**: Same VPC as your ECS instance

### 1.4 Set Up OSS Bucket (Optional)

If you want to store uploaded files in OSS instead of local storage:

1. Navigate to OSS (Object Storage Service)
2. Create a new bucket for file uploads
3. Configure CORS if needed

## Step 2: Prepare Your Application

### 2.1 Environment Configuration

Create a `.env.production` file in your project root:

```env
# Database Configuration
DATABASE_HOST=your-rds-endpoint
DATABASE_PORT=5432
DATABASE_USERNAME=your-db-username
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=livestream

# Redis Configuration
REDIS_HOST=your-redis-endpoint
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# SMS Configuration (Aliyun SMS)
SMS_ACCESS_KEY_ID=your-sms-access-key
SMS_ACCESS_KEY_SECRET=your-sms-secret
SMS_SIGN_NAME=your-sms-sign-name
SMS_TEMPLATE_CODE=your-sms-template-code

# Application Configuration
NODE_ENV=production
PORT=5000

# File Upload Configuration
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=10485760

# Agora Configuration (if using Agora for live streaming)
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-app-certificate
```

### 2.2 Update Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build:prod": "nest build",
    "start:prod": "node dist/main",
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop ecosystem.config.js",
    "pm2:restart": "pm2 restart ecosystem.config.js",
    "pm2:delete": "pm2 delete ecosystem.config.js"
  }
}
```

### 2.3 Create PM2 Ecosystem File

Create `ecosystem.config.js` in your project root:

```javascript
module.exports = {
  apps: [{
    name: 'livestream-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads']
  }]
};
```

### 2.4 Create Nginx Configuration

Create `nginx.conf` in your project root:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;  # Replace with your domain

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # API proxy
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # File uploads
    location /uploads/ {
        alias /app/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Swagger documentation
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Step 3: Deploy to ECS

### 3.1 Connect to Your ECS Instance

```bash
ssh root@your-ecs-ip
```

### 3.2 Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install PostgreSQL client
apt install postgresql-client -y

# Install Redis client
apt install redis-tools -y

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y
```

### 3.3 Create Application Directory

```bash
mkdir -p /app/livestream-backend
mkdir -p /app/logs
mkdir -p /app/uploads
chown -R www-data:www-data /app/uploads
```

### 3.4 Deploy Your Code

Option 1: Using Git (Recommended)

```bash
cd /app
git clone https://github.com/your-username/livestream-backend.git
cd livestream-backend
npm install
npm run build:prod
```

Option 2: Using SCP

```bash
# From your local machine
scp -r ./src root@your-ecs-ip:/app/livestream-backend/
scp package*.json root@your-ecs-ip:/app/livestream-backend/
scp tsconfig.json root@your-ecs-ip:/app/livestream-backend/
scp ecosystem.config.js root@your-ecs-ip:/app/livestream-backend/

# Then on the server
cd /app/livestream-backend
npm install
npm run build:prod
```

### 3.5 Configure Environment Variables

```bash
cd /app/livestream-backend
cp .env.production .env
# Edit .env with your actual values
nano .env
```

### 3.6 Run Database Migrations

```bash
cd /app/livestream-backend
npm run migration:run
```

### 3.7 Configure Nginx

```bash
# Copy your nginx configuration
cp nginx.conf /etc/nginx/sites-available/livestream-backend
ln -s /etc/nginx/sites-available/livestream-backend /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site

# Test nginx configuration
nginx -t

# Restart nginx
systemctl restart nginx
systemctl enable nginx
```

### 3.8 Set Up SSL Certificate

```bash
# Replace with your actual domain
certbot --nginx -d your-domain.com
```

### 3.9 Start the Application

```bash
cd /app/livestream-backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Step 4: Monitoring and Maintenance

### 4.1 Set Up Log Rotation

Create `/etc/logrotate.d/livestream-backend`:

```
/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 4.2 Set Up Health Checks

Create a simple health check endpoint in your application or use PM2's built-in monitoring:

```bash
pm2 monit
```

### 4.3 Set Up Backups

Create a backup script `/app/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/app/backups"

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -h your-rds-endpoint -U your-username -d livestream > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /app/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make it executable and add to crontab:

```bash
chmod +x /app/backup.sh
crontab -e
# Add this line: 0 2 * * * /app/backup.sh
```

## Step 5: Scaling (Optional)

### 5.1 Load Balancer Setup

1. Create an SLB instance in Aliyun
2. Add your ECS instances to the backend server group
3. Configure health checks
4. Set up listeners for HTTP/HTTPS traffic

### 5.2 Auto Scaling

1. Create an Auto Scaling Group
2. Configure scaling policies based on CPU/memory usage
3. Set up launch templates for new instances

## Troubleshooting

### Common Issues

1. **Port not accessible**: Check security group rules
2. **Database connection failed**: Verify RDS endpoint and credentials
3. **File uploads not working**: Check directory permissions
4. **SSL certificate issues**: Verify domain DNS settings

### Useful Commands

```bash
# Check application status
pm2 status
pm2 logs livestream-backend

# Check nginx status
systemctl status nginx
nginx -t

# Check system resources
htop
df -h
free -h

# Check network connectivity
netstat -tlnp
```

## Security Considerations

1. **Firewall**: Configure security groups to allow only necessary ports
2. **SSL**: Always use HTTPS in production
3. **Environment Variables**: Never commit sensitive data to version control
4. **Regular Updates**: Keep system and dependencies updated
5. **Backups**: Regular database and file backups
6. **Monitoring**: Set up alerts for system health

## Cost Optimization

1. **Reserved Instances**: Purchase reserved instances for predictable workloads
2. **Auto Scaling**: Scale down during low traffic periods
3. **Storage**: Use appropriate storage types for your use case
4. **CDN**: Use Aliyun CDN for static assets if needed

This deployment guide provides a comprehensive approach to deploying your NestJS livestream backend on Aliyun. Adjust the configurations based on your specific requirements and scale. 