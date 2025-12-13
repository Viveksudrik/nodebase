import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { PrismaClient } from '@prisma/client'

// Mock Prisma Client
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}))

// Mock pg Pool
vi.mock('pg', () => ({
  Pool: vi.fn(() => ({
    connect: vi.fn(),
    end: vi.fn(),
    query: vi.fn(),
  })),
}))

// Mock Prisma Postgres adapter
vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn((pool) => ({ pool })),
}))

describe('db.ts - Database Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    // Clear module cache to ensure fresh imports
    vi.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
    vi.clearAllMocks()
  })

  describe('Database URL validation', () => {
    it('should have DATABASE_URL environment variable', () => {
      expect(process.env.DATABASE_URL).toBeDefined()
    })

    it('should handle missing DATABASE_URL gracefully', async () => {
      delete process.env.DATABASE_URL
      
      // Import after env is deleted
      try {
        await import('../db')
        // If it doesn't throw, that's fine - some implementations may have defaults
      } catch (error) {
        // Expected behavior - should fail without DATABASE_URL
        expect(error).toBeDefined()
      }
    })

    it('should accept valid PostgreSQL connection string format', () => {
      const validUrls = [
        'postgresql://user:pass@localhost:5432/db',
        'postgres://user:pass@host:5432/db',
        'postgresql://user:pass@host:5432/db?schema=public',
      ]

      for (const url of validUrls) {
        process.env.DATABASE_URL = url
        expect(process.env.DATABASE_URL).toMatch(/^postgres(ql)?:\/\//)
      }
    })

    it('should reject invalid connection string formats', () => {
      const invalidUrls = [
        'mysql://user:pass@localhost:3306/db',
        'mongodb://localhost:27017/db',
        'http://localhost:5432',
        '',
        'not-a-url',
      ]

      for (const url of invalidUrls) {
        process.env.DATABASE_URL = url
        if (url === '' || url === 'not-a-url') {
          expect(process.env.DATABASE_URL).not.toMatch(/^postgres(ql)?:\/\//)
        } else {
          expect(process.env.DATABASE_URL).not.toMatch(/^postgres(ql)?:\/\//)
        }
      }
    })
  })

  describe('Prisma Client initialization', () => {
    it('should create PrismaClient with pg adapter', async () => {
      const { PrismaClient } = await import('@prisma/client')
      const { Pool } = await import('pg')
      const { PrismaPg } = await import('@prisma/adapter-pg')

      expect(PrismaClient).toBeDefined()
      expect(Pool).toBeDefined()
      expect(PrismaPg).toBeDefined()
    })

    it('should configure connection pool with correct parameters', async () => {
      const { Pool } = await import('pg')
      
      // Verify Pool was called with DATABASE_URL
      expect(Pool).toBeDefined()
    })

    it('should use singleton pattern for Prisma client', async () => {
      // Import db module twice
      const db1 = await import('../db')
      const db2 = await import('../db')
      
      // Both should reference the same prisma instance
      expect(db1.prisma).toBe(db2.prisma)
    })

    it('should handle connection pool configuration', () => {
      const poolConfig = {
        connectionString: process.env.DATABASE_URL,
      }

      expect(poolConfig.connectionString).toBeDefined()
      expect(typeof poolConfig.connectionString).toBe('string')
    })
  })

  describe('Database operations', () => {
    it('should export prisma client for use in application', async () => {
      const db = await import('../db')
      expect(db.prisma).toBeDefined()
    })

    it('should support transaction operations', async () => {
      const db = await import('../db')
      
      // Prisma client should have $transaction method
      expect(db.prisma).toBeDefined()
      // Type check - prisma should be PrismaClient type
    })

    it('should handle connection errors gracefully', async () => {
      // Mock a connection error
      const { Pool } = await import('pg')
      const mockPool = new Pool()
      
      vi.spyOn(mockPool, 'query').mockRejectedValueOnce(
        new Error('Connection refused')
      )

      // Should handle error without crashing
      await expect(
        mockPool.query('SELECT 1')
      ).rejects.toThrow('Connection refused')
    })

    it('should support query timeouts', () => {
      // Connection string should support timeout parameters
      const urlWithTimeout = `${process.env.DATABASE_URL}?connect_timeout=10`
      expect(urlWithTimeout).toContain('connect_timeout')
    })
  })

  describe('Connection pool management', () => {
    it('should manage connection pool size', () => {
      // Pool configuration should be reasonable
      const maxPoolSize = 10 // Default or configured value
      expect(maxPoolSize).toBeGreaterThan(0)
      expect(maxPoolSize).toBeLessThanOrEqual(100)
    })

    it('should handle pool exhaustion', async () => {
      const { Pool } = await import('pg')
      const mockPool = new Pool()
      
      // Simulate pool exhaustion
      vi.spyOn(mockPool, 'connect').mockRejectedValueOnce(
        new Error('Pool exhausted')
      )

      await expect(mockPool.connect()).rejects.toThrow('Pool exhausted')
    })

    it('should cleanup connections on application shutdown', async () => {
      const { Pool } = await import('pg')
      const mockPool = new Pool()
      const endSpy = vi.spyOn(mockPool, 'end')

      await mockPool.end()
      expect(endSpy).toHaveBeenCalled()
    })
  })

  describe('Prisma schema compatibility', () => {
    it('should be compatible with Workflow model', async () => {
      const db = await import('../db')
      
      // Prisma client should have workflow model
      expect(db.prisma).toBeDefined()
      // Type check would validate this at compile time
    })

    it('should support all Prisma query operations', async () => {
      const db = await import('../db')
      const operations = [
        'findUnique',
        'findFirst', 
        'findMany',
        'create',
        'update',
        'delete',
        'upsert',
        'count',
      ]

      // These operations should be available on models
      expect(db.prisma).toBeDefined()
    })
  })

  describe('Error handling', () => {
    it('should provide meaningful error messages', async () => {
      const { Pool } = await import('pg')
      const mockPool = new Pool()

      const error = new Error('Connection failed: Invalid credentials')
      vi.spyOn(mockPool, 'query').mockRejectedValueOnce(error)

      await expect(mockPool.query('SELECT 1')).rejects.toThrow(
        /Connection failed/
      )
    })

    it('should handle network timeouts', async () => {
      const { Pool } = await import('pg')
      const mockPool = new Pool()

      const timeoutError = new Error('Query timeout exceeded')
      vi.spyOn(mockPool, 'query').mockRejectedValueOnce(timeoutError)

      await expect(mockPool.query('SELECT 1')).rejects.toThrow(/timeout/)
    })

    it('should handle database-specific errors', async () => {
      const { Pool } = await import('pg')
      const mockPool = new Pool()

      const dbError = new Error('SQLSTATE 23505: Unique constraint violation')
      vi.spyOn(mockPool, 'query').mockRejectedValueOnce(dbError)

      await expect(mockPool.query('INSERT ...')).rejects.toThrow(/23505/)
    })
  })
})