# Test Documentation

## Overview
This document describes the comprehensive test suite for the nodebase project, covering all changes introduced in the current branch.

## Test Structure

### Testing Framework
- **Framework**: Vitest
- **Environment**: Node.js
- **Test Runner**: Vitest with TypeScript support
- **Mocking**: Vi test utilities

### Test Coverage

#### 1. Database Layer Tests (`src/lib/__tests__/db.test.ts`)
Tests for Prisma database configuration and connection management:
- ✅ Database URL validation
- ✅ Prisma Client initialization with pg adapter
- ✅ Connection pool configuration
- ✅ Singleton pattern verification
- ✅ Transaction support
- ✅ Error handling for connection issues
- ✅ Pool management and cleanup
- ✅ Schema compatibility checks

**Key Test Scenarios**:
- Valid/invalid PostgreSQL connection strings
- Missing DATABASE_URL handling
- Connection pool exhaustion
- Query timeouts
- Database-specific error handling

#### 2. Inngest Client Tests (`src/inngest/__tests__/client.test.ts`)
Tests for Inngest event system client:
- ✅ Client initialization with correct app ID
- ✅ Singleton pattern verification
- ✅ Event sending capabilities
- ✅ Batch event handling
- ✅ Environment variable validation
- ✅ Error handling for failed events
- ✅ TypeScript type safety
- ✅ Integration with Inngest platform

**Key Test Scenarios**:
- Client creation with "nodebase" ID
- Event key and signing key configuration
- Single and batch event sending
- Invalid app ID handling
- Event structure validation

#### 3. Inngest Functions Tests (`src/app/api/inngest/__tests__/functions.test.ts`)
Tests for Inngest function definitions:
- ✅ Function export verification
- ✅ Function ID and name validation
- ✅ Event trigger configuration
- ✅ Function handler execution
- ✅ Step.run pattern usage
- ✅ Event data handling
- ✅ Error handling in functions
- ✅ Prisma integration
- ✅ Async processing
- ✅ Type safety

**Key Test Scenarios**:
- Hello World function execution
- Event data processing
- Step-based execution
- Retry mechanisms
- Database operations within functions

#### 4. Inngest Route Tests (`src/app/api/inngest/__tests__/route.test.ts`)
Tests for Next.js API route handler:
- ✅ Route handler exports (GET, POST, PUT)
- ✅ Inngest serve configuration
- ✅ Function registration
- ✅ HTTP request handling
- ✅ Webhook signature validation
- ✅ Request/response processing
- ✅ Error handling
- ✅ Next.js App Router integration

**Key Test Scenarios**:
- Inngest webhook processing
- Request signature validation
- Malformed request handling
- Function execution errors
- Response status codes

#### 5. tRPC Router Tests (`src/trpc/routers/__tests__/_app.test.ts`)
Tests for tRPC application router:
- ✅ Router structure and exports
- ✅ Workflow query procedures
- ✅ Workflow mutation procedures
- ✅ Input validation (Zod schemas)
- ✅ Inngest event triggering
- ✅ Error handling (Prisma errors)
- ✅ Type safety
- ✅ Performance (pagination, concurrency)

**Key Test Scenarios**:
- Get all workflows query
- Create workflow mutation
- Input validation and sanitization
- Database error handling
- Inngest integration
- Concurrent request handling

#### 6. Prisma Schema Tests (`prisma/__tests__/schema.test.ts`)
Tests for Prisma schema structure:
- ✅ Schema format validation
- ✅ PostgreSQL provider configuration
- ✅ Workflow model definition
- ✅ Generator configuration
- ✅ Datasource configuration
- ✅ Field types and decorators
- ✅ Best practices (timestamps, IDs)
- ✅ Migration compatibility

**Key Test Scenarios**:
- Valid Prisma syntax
- Required model fields
- Proper decorators (@id, @default, @updatedAt)
- Environment variable usage
- PostgreSQL compatibility

#### 7. Prisma Config Tests (`prisma.config.test.ts`)
Tests for Prisma configuration file:
- ✅ Configuration export structure
- ✅ Schema path configuration
- ✅ TypeScript compatibility
- ✅ Import/export validation

## Running Tests

### Install Dependencies
```bash
npm install vitest @vitest/ui @types/node --save-dev
```

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx vitest src/lib/__tests__/db.test.ts
```

### Run with Coverage
```bash
npx vitest --coverage
```

### Run in Watch Mode
```bash
npx vitest --watch
```

### Run with UI
```bash
npx vitest --ui
```

## Test Configuration

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Environment Variables for Testing
Required environment variables in `src/__tests__/setup.ts`:
- `DATABASE_URL`: PostgreSQL connection string
- `INNGEST_EVENT_KEY`: Inngest event key
- `INNGEST_SIGNING_KEY`: Inngest signing key

## Mocking Strategy

### External Dependencies
All external dependencies are mocked to ensure isolated unit tests:
- `@prisma/client`: Mocked with stub database operations
- `pg`: Mocked Pool for connection management
- `inngest`: Mocked Inngest client and serve functions
- `inngest/next`: Mocked Next.js integration

### Database Mocking
Prisma client is mocked with:
```typescript
const mockPrismaClient = () => ({
  workflow: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $disconnect: vi.fn(),
})
```

## Coverage Goals

Target coverage metrics:
- **Line Coverage**: > 80%
- **Branch Coverage**: > 75%
- **Function Coverage**: > 85%
- **Statement Coverage**: > 80%

## Best Practices Implemented

1. **Isolation**: Each test is independent and doesn't rely on external state
2. **Mocking**: External dependencies are properly mocked
3. **Descriptive Names**: Test names clearly describe what is being tested
4. **Arrange-Act-Assert**: Tests follow AAA pattern
5. **Edge Cases**: Tests cover happy path, edge cases, and error conditions
6. **Type Safety**: TypeScript types are validated in tests
7. **Async Handling**: Proper async/await usage throughout
8. **Cleanup**: Proper setup and teardown in beforeEach/afterEach hooks

## Continuous Integration

Recommended CI configuration:
```yaml
test:
  script:
    - npm install
    - npm test
    - npm run test:coverage
```

## Maintenance

### Adding New Tests
1. Create test file next to source file with `.test.ts` extension
2. Import necessary mocks and utilities
3. Follow existing test patterns
4. Run tests to verify
5. Update this documentation

### Updating Tests
When modifying source code:
1. Update corresponding tests
2. Ensure all tests pass
3. Maintain coverage metrics
4. Update documentation if needed

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Ensure `@` alias is configured in tsconfig.json and vitest.config.ts
   
2. **Mock Import Errors**
   - Verify mocks are defined before importing modules
   - Use `vi.resetModules()` between tests if needed

3. **Async Test Failures**
   - Ensure proper async/await usage
   - Check timeout settings for long-running tests

4. **Environment Variable Issues**
   - Verify setup.ts is properly configured
   - Check env vars are set before tests run

## Future Enhancements

Potential test improvements:
- Integration tests with test database
- E2E tests for API routes
- Performance benchmarking tests
- Load testing for concurrent operations
- Snapshot testing for schema changes
- Property-based testing with fast-check

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [tRPC Testing](https://trpc.io/docs/server/testing)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)