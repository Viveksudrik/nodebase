# Installation and Setup Instructions

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git repository initialized

## Step 1: Install Dependencies

The updated `package.json` includes these new devDependencies:
- `vitest@^2.1.8` - Fast test runner
- `@vitest/ui@^2.1.8` - UI interface for tests
- `@vitest/coverage-v8@^2.1.8` - Coverage reporting

Install all dependencies:
```bash
npm install
```

Or if you prefer yarn:
```bash
yarn install
```

## Step 2: Verify Installation

Check that Vitest is installed:
```bash
npx vitest --version
```

Expected output: `vitest/2.1.8`

## Step 3: Run Tests

Run the complete test suite:
```bash
npm test
```

This will execute all 137+ test cases across 7 test files.

## Step 4: View Test Results

### Watch Mode (for development)
```bash
npm run test:watch
```

### UI Mode (visual interface)
```bash
npm run test:ui
```

Then open your browser to the URL shown (typically http://localhost:51204)

### Coverage Report
```bash
npm run test:coverage
```

Then open `coverage/index.html` in your browser.

## Step 5: Integrate with CI/CD

### GitHub Actions Example

Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Generate coverage
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Environment Variables

For tests to run properly, ensure these environment variables are set (they're mocked in tests):
- `DATABASE_URL` - PostgreSQL connection string
- `INNGEST_EVENT_KEY` - Inngest event key
- `INNGEST_SIGNING_KEY` - Inngest signing key

Tests use mock values defined in `src/__tests__/setup.ts`, so you don't need to set these for testing.

## Troubleshooting

### Issue: "Cannot find module 'vitest'"
**Solution**: Run `npm install` to install dependencies

### Issue: "Module resolution errors"
**Solution**: Check that `@/` alias is configured in both `tsconfig.json` and `vitest.config.ts`

### Issue: Tests fail with "Cannot find module '@/lib/db'"
**Solution**: Ensure `vitest.config.ts` has the correct path alias:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Issue: Coverage not generating
**Solution**: Install coverage package: `npm install -D @vitest/coverage-v8`

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open test UI in browser |
| `npm run test:coverage` | Generate coverage report |
| `npx vitest <file>` | Run specific test file |
| `npx vitest --grep <pattern>` | Run tests matching pattern |

## File Structure