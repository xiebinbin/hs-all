# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Super API** application built with **Hono** framework, implementing a JSON-RPC 2.0 API server with enterprise-grade authentication using Better Auth. The project uses **TypeScript**, **PostgreSQL** with **Drizzle ORM**, and **Bun** as the runtime.

## Common Development Commands

### Database Operations
```bash
# Generate database schema types
bun run db:generate

# Run database migrations
bun run db:migrate
```

### Development
```bash
# Install dependencies
bun install

# Start development server (hot reload)
bun run dev

# Server runs on http://localhost:3000 by default
```

### Testing
```bash
# Run tests (if test framework is added)
bun test
```

## Architecture Overview

### Core Components

**1. JSON-RPC 2.0 System**
- Central RPC registry at `src/rpc/registry.ts` manages all method registration
- Method handler at `src/rpc/handler.ts` processes requests
- Service classes register methods using the registry pattern
- Support for method discovery via `GET /json-rpc`

**2. Authentication System**
- Uses **Better Auth** with PostgreSQL adapter
- Configuration in `src/lib/auth.ts`
- Supports email/password and phone number authentication
- Includes admin and bearer token plugins
- Phone verification with libphonenumber-js

**3. Database Layer**
- **Drizzle ORM** with PostgreSQL
- Schema definitions in `src/db/schemas/`
- Database configuration in `src/db/index.ts`
- Migration support via drizzle-kit

**4. Middleware Stack**
- Authentication middleware (`src/middleware/auth.ts`)
- Parameter validation (`src/middleware/params.ts`)
- Error handling (`src/middleware/errorHandler.ts`)
- Logging (`src/middleware/logging.ts`)

### Project Structure

```
src/
├── config/          # Application configuration
├── db/              # Database schemas and connection
├── lib/             # Core libraries (auth)
├── middleware/      # Request middleware
├── rpc/             # JSON-RPC implementation
│   ├── constants/   # Error codes and method definitions
│   ├── services/    # Business logic services
│   ├── bootstrap.ts # Service registration
│   ├── handler.ts   # Request handler
│   └── registry.ts  # Method registry
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

## Key Patterns

### RPC Method Registration
Services register methods using the registry pattern:
```typescript
// Services are registered in bootstrap.ts
rpcRegistry.registerService(authService, 'auth');
```

### Authentication Flow
1. Better Auth handles `/api/auth/*` routes
2. RPC methods use middleware for session validation
3. Context carries user/session information

### Error Handling
- Custom RPC errors in `src/rpc/constants/errors.ts`
- Global error handler standardizes responses
- Logging integration for debugging

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret (min 32 chars)

Optional:
- `PORT` - Server port (default: 3000)
- `HOSTNAME` - Server hostname (default: 0.0.0.0)
- `NODE_ENV` - Environment (default: development)
- `CORS_ORIGIN` - CORS origin (default: http://localhost:3001)

## Development Guidelines

### Adding New RPC Methods
1. Create service class in `src/rpc/services/`
2. Register methods in `src/rpc/bootstrap.ts`
3. Add method metadata if needed
4. Test via `/json-rpc` discovery endpoint

### Database Changes
1. Update schema in `src/db/schemas/`
2. Run `bun run db:generate`
3. Create migration with `bun run db:migrate`

### Authentication Integration
- Use Better Auth methods for user operations
- Leverage existing middleware for RPC auth
- Context provides user/session information