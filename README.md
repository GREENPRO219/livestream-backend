# Live Streaming Platform Backend

A robust backend service for a live streaming platform built with NestJS, TypeORM, and PostgreSQL.

## Features

### Authentication
- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Protected routes with JWT guard

### User Management
- User profiles
- User search and discovery
- Profile updates

### Media Management
- Upload and manage media files
- Support for different media types
- Media metadata management
- Media search and filtering

### Chat System
- Real-time chat using WebSocket
- Private and group chat support
- Message history
- Online user status

### Room Management
- Create and join rooms
- Private rooms with password protection
- Room member management
- Room search and discovery

### Social Features
- Like/unlike media and rooms
- Favorite/unfavorite media and rooms
- Toggle likes and favorites
- Get user likes and favorites

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **Real-time**: WebSocket (Socket.IO)
- **File Storage**: Local file system
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=live_streaming

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# Server
PORT=3000
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd live-streaming-backend
```

2. Install dependencies:
```bash
npm install
```

3. Run migrations:
```bash
npm run migration:run
```

4. Start the development server:
```bash
npm run start:dev
```

## Project Structure

```
src/
├── auth/                 # Authentication module
├── users/               # User management
├── media/               # Media handling
├── chat/                # Chat system
├── rooms/               # Room management
├── likes/               # Like functionality
├── favorites/           # Favorite functionality
├── common/              # Shared utilities and types
└── migrations/          # Database migrations
```

## Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 