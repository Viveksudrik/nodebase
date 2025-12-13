import { beforeAll, afterAll, vi } from 'vitest'

// Mock environment variables for tests
beforeAll(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.INNGEST_EVENT_KEY = 'test-event-key'
  process.env.INNGEST_SIGNING_KEY = 'test-signing-key'
})

afterAll(() => {
  vi.clearAllMocks()
})

// Global test utilities
export const mockPrismaClient = () => ({
  workflow: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $disconnect: vi.fn(),
})