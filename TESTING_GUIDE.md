# Testing Guide for Nodebase

## Quick Start

### Installation
```bash
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Suite Overview

This comprehensive test suite covers all the new functionality added in the current branch:

### 1. Database Layer (`src/lib/__tests__/db.test.ts`)
- **54 test cases** covering Prisma with PostgreSQL adapter
- Database URL validation and connection management
- Connection pool configuration and lifecycle
- Error handling for various database scenarios
- Singleton pattern verification

### 2. Inngest Client (`src/inngest/__tests__/client.test.ts`)
- **32 test cases** for event system client
- Client initialization and configuration
- Event sending (single and batch)
- Error handling and validation
- TypeScript type safety

### 3. Inngest Functions (`src/app/api/inngest/__tests__/functions.test.ts`)
- **45 test cases** for workflow functions
- Function definition and configuration
- Event handling and data processing
- Step-based execution pattern
- Integration with Prisma database
- Retry mechanisms and error handling

### 4. Inngest API Route (`src/app/api/inngest/__tests__/route.test.ts`)
- **38 test cases** for Next.js API route
- HTTP method handlers (GET, POST, PUT)
- Webhook request processing
- Signature validation
- Function registration
- Next.js App Router integration

### 5. tRPC Router (`src/trpc/routers/__tests__/_app.test.ts`)
- **42 test cases** for API router
- Query and mutation procedures
- Workflow CRUD operations
- Input validation with Zod
- Inngest event triggering
- Performance and concurrency handling

### 6. Prisma Schema (`prisma/__tests__/schema.test.ts`)
- **18 test cases** for schema validation
- Schema structure and syntax
- Model definitions and relationships
- Generator and datasource configuration
- Best practices compliance

### 7. Prisma Configuration (`prisma.config.test.ts`)
- **10 test cases** for configuration file
- Schema path configuration
- TypeScript compatibility
- Import/export validation

## Total Test Coverage

- **239 comprehensive test cases**
- Coverage across all changed files
- Happy paths, edge cases, and error conditions
- Integration points validated
- Type safety verified

## Test Architecture

### Mocking Strategy
All external dependencies are mocked for isolated unit tests:

```typescript
// Prisma Client
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    workflow: {
      create: vi.fn(),
      findMany: vi.fn(),
      // ... other methods
    },
  })),
}))

// Inngest
vi.mock('inngest', () => ({
  Inngest: vi.fn().mockImplementation((config) => ({
    config,
    send: vi.fn(),
    createFunction: vi.fn(),
  })),
}))

// PostgreSQL Pool
vi.mock('pg', () => ({
  Pool: vi.fn(() => ({
    connect: vi.fn(),
    query: vi.fn(),
    end: vi.fn(),
  })),
}))
```

### Test Setup
Global test configuration in `src/__tests__/setup.ts`:

```typescript
import { beforeAll, afterAll, vi } from 'vitest'

beforeAll(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.INNGEST_EVENT_KEY = 'test-event-key'
  process.env.INNGEST_SIGNING_KEY = 'test-signing-key'
})

afterAll(() => {
  vi.clearAllMocks()
})
```

## Key Test Scenarios

### Database Layer Tests
- ✅ Valid/invalid PostgreSQL connection strings
- ✅ Missing DATABASE_URL handling
- ✅ Connection pool exhaustion scenarios
- ✅ Query timeouts and database errors
- ✅ Transaction support verification
- ✅ Prisma adapter configuration

### Inngest Tests
- ✅ Event sending (single and batch)
- ✅ Function execution with step pattern
- ✅ Webhook signature validation
- ✅ Error handling and retries
- ✅ Integration with Next.js API routes
- ✅ Development and production mode support

### tRPC Tests
- ✅ Query procedures (getWorkflows)
- ✅ Mutation procedures (createWorkflow)
- ✅ Input validation and sanitization
- ✅ Inngest event triggering
- ✅ Concurrent request handling
- ✅ Pagination support

### Schema Tests
- ✅ Prisma schema syntax validation
- ✅ Model definitions and field types
- ✅ Decorators (@id, @default, @updatedAt)
- ✅ PostgreSQL compatibility
- ✅ Migration best practices

## Running Specific Tests

```bash
# Run specific test file
npx vitest src/lib/__tests__/db.test.ts

# Run tests matching pattern
npx vitest --grep "Database URL validation"

# Run tests for specific file
npx vitest --run src/inngest/__tests__/client.test.ts
```

## Viewing Coverage

After running `npm run test:coverage`, open: