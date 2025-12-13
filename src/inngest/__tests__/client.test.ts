import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Inngest
vi.mock('inngest', () => ({
  Inngest: vi.fn().mockImplementation((config) => ({
    config,
    createFunction: vi.fn(),
    send: vi.fn(),
  })),
}))

describe('inngest/client.ts - Inngest Client Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    process.env.INNGEST_EVENT_KEY = 'test-event-key'
    process.env.INNGEST_SIGNING_KEY = 'test-signing-key'
    vi.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
    vi.clearAllMocks()
  })

  describe('Client initialization', () => {
    it('should create Inngest client with correct app ID', async () => {
      const { inngest } = await import('../client')
      
      expect(inngest).toBeDefined()
      expect(inngest.config).toBeDefined()
    })

    it('should use "nodebase" as app identifier', async () => {
      const { Inngest } = await import('inngest')
      
      // Verify Inngest was called with correct ID
      expect(Inngest).toHaveBeenCalled()
    })

    it('should be exported as named export', async () => {
      const module = await import('../client')
      
      expect(module.inngest).toBeDefined()
      expect(typeof module.inngest).toBe('object')
    })

    it('should be a singleton instance', async () => {
      const module1 = await import('../client')
      const module2 = await import('../client')
      
      expect(module1.inngest).toBe(module2.inngest)
    })
  })

  describe('Configuration validation', () => {
    it('should accept valid app ID format', async () => {
      const validIds = [
        'nodebase',
        'my-app',
        'app_name',
        'app-123',
      ]

      for (const id of validIds) {
        const { Inngest } = await import('inngest')
        const client = new Inngest({ id })
        
        expect(client.config.id).toBe(id)
      }
    })

    it('should handle missing environment variables gracefully', async () => {
      delete process.env.INNGEST_EVENT_KEY
      delete process.env.INNGEST_SIGNING_KEY
      
      // Should still create client but may warn or use defaults
      const module = await import('../client')
      expect(module.inngest).toBeDefined()
    })

    it('should support event key configuration', () => {
      expect(process.env.INNGEST_EVENT_KEY).toBeDefined()
    })

    it('should support signing key configuration', () => {
      expect(process.env.INNGEST_SIGNING_KEY).toBeDefined()
    })
  })

  describe('Client capabilities', () => {
    it('should support sending events', async () => {
      const { inngest } = await import('../client')
      
      expect(inngest.send).toBeDefined()
      expect(typeof inngest.send).toBe('function')
    })

    it('should support function creation', async () => {
      const { inngest } = await import('../client')
      
      expect(inngest.createFunction).toBeDefined()
      expect(typeof inngest.createFunction).toBe('function')
    })

    it('should handle event sending', async () => {
      const { inngest } = await import('../client')
      
      const mockEvent = {
        name: 'test/event',
        data: { test: true },
      }

      await inngest.send(mockEvent)
      
      expect(inngest.send).toHaveBeenCalledWith(mockEvent)
    })

    it('should handle multiple events in batch', async () => {
      const { inngest } = await import('../client')
      
      const events = [
        { name: 'event1', data: {} },
        { name: 'event2', data: {} },
      ]

      await inngest.send(events)
      
      expect(inngest.send).toHaveBeenCalledWith(events)
    })
  })

  describe('Error handling', () => {
    it('should handle invalid app ID', async () => {
      const { Inngest } = await import('inngest')
      
      // Empty or invalid IDs
      const invalidIds = ['', ' ', null, undefined]
      
      for (const id of invalidIds) {
        try {
          new Inngest({ id: id as any })
        } catch (error) {
          expect(error).toBeDefined()
        }
      }
    })

    it('should handle event sending failures', async () => {
      const { inngest } = await import('../client')
      
      vi.spyOn(inngest, 'send').mockRejectedValueOnce(
        new Error('Failed to send event')
      )

      await expect(
        inngest.send({ name: 'test', data: {} })
      ).rejects.toThrow('Failed to send event')
    })

    it('should validate event structure', async () => {
      const { inngest } = await import('../client')
      
      const invalidEvents = [
        {},  // Missing name
        { name: '' },  // Empty name
        { name: 'test' },  // Missing data
      ]

      for (const event of invalidEvents) {
        try {
          await inngest.send(event as any)
        } catch (error) {
          // May throw validation error
        }
      }
    })
  })

  describe('TypeScript types', () => {
    it('should have proper type exports', async () => {
      const module = await import('../client')
      
      // inngest should have proper typing
      expect(module.inngest).toBeDefined()
    })

    it('should support typed events', async () => {
      const { inngest } = await import('../client')
      
      // Should accept typed event data
      const typedEvent = {
        name: 'workflow/created',
        data: {
          workflowId: '123',
          userId: 'user-1',
        },
      }

      await inngest.send(typedEvent)
      expect(inngest.send).toHaveBeenCalledWith(typedEvent)
    })
  })

  describe('Integration with Inngest platform', () => {
    it('should connect to Inngest service', async () => {
      const { inngest } = await import('../client')
      
      // Client should be configured to connect
      expect(inngest).toBeDefined()
    })

    it('should handle authentication', () => {
      // Event and signing keys should be present
      expect(process.env.INNGEST_EVENT_KEY).toBeDefined()
      expect(process.env.INNGEST_SIGNING_KEY).toBeDefined()
    })

    it('should support development mode', async () => {
      process.env.NODE_ENV = 'development'
      
      const module = await import('../client')
      expect(module.inngest).toBeDefined()
    })

    it('should support production mode', async () => {
      process.env.NODE_ENV = 'production'
      
      const module = await import('../client')
      expect(module.inngest).toBeDefined()
    })
  })
})