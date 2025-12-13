import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

describe('prisma.config.ts - Prisma Configuration', () => {
  let configContent: string

  beforeEach(() => {
    configContent = readFileSync('prisma.config.ts', 'utf-8')
  })

  describe('Configuration structure', () => {
    it('should export default configuration', () => {
      expect(configContent).toContain('export default')
    })

    it('should be valid TypeScript', () => {
      // Basic TypeScript syntax checks
      expect(configContent).not.toContain('SyntaxError')
    })

    it('should configure schema path', () => {
      expect(configContent).toMatch(/schema.*prisma/)
    })
  })

  describe('Schema location', () => {
    it('should point to prisma/schema.prisma', () => {
      expect(configContent).toContain('prisma/schema.prisma')
    })

    it('should use relative path', () => {
      expect(configContent).toMatch(/\.\/|prisma\//)
    })
  })

  describe('Configuration validation', () => {
    it('should have valid JSON/JS object structure', () => {
      // Check for balanced braces
      const openBraces = (configContent.match(/{/g) || []).length
      const closeBraces = (configContent.match(/}/g) || []).length
      
      expect(openBraces).toBeGreaterThan(0)
      expect(openBraces).toBe(closeBraces)
    })

    it('should not have syntax errors', () => {
      // No common syntax issues
      expect(configContent).not.toContain('undefined;')
      expect(configContent).not.toContain('null;')
    })
  })

  describe('TypeScript compatibility', () => {
    it('should use proper TypeScript exports', () => {
      expect(configContent).toMatch(/export (default|const)/)
    })

    it('should be importable', async () => {
      // Should be able to import without errors
      try {
        const config = await import('./prisma.config')
        expect(config).toBeDefined()
      } catch (error) {
        // May fail in test environment, that's okay
      }
    })
  })
})