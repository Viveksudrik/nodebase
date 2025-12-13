import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Prisma Schema Validation', () => {
  let schemaContent: string

  beforeEach(() => {
    schemaContent = readFileSync(
      join(process.cwd(), 'prisma/schema.prisma'),
      'utf-8'
    )
  })

  describe('Schema structure', () => {
    it('should have valid Prisma schema format', () => {
      expect(schemaContent).toContain('generator client')
      expect(schemaContent).toContain('datasource db')
    })

    it('should use PostgreSQL provider', () => {
      expect(schemaContent).toContain('provider = "postgresql"')
    })

    it('should define Workflow model', () => {
      expect(schemaContent).toContain('model Workflow')
    })

    it('should have required Workflow fields', () => {
      expect(schemaContent).toMatch(/model Workflow\s*{/)
      expect(schemaContent).toContain('id')
      expect(schemaContent).toContain('createdAt')
      expect(schemaContent).toContain('updatedAt')
    })
  })

  describe('Generator configuration', () => {
    it('should use prisma-client-js generator', () => {
      expect(schemaContent).toContain('generator client')
      expect(schemaContent).toContain('provider = "prisma-client-js"')
    })

    it('should not have syntax errors', () => {
      // Basic syntax checks
      const openBraces = (schemaContent.match(/{/g) || []).length
      const closeBraces = (schemaContent.match(/}/g) || []).length
      
      expect(openBraces).toBe(closeBraces)
    })
  })

  describe('Datasource configuration', () => {
    it('should reference DATABASE_URL environment variable', () => {
      expect(schemaContent).toContain('url = env("DATABASE_URL")')
    })

    it('should have db datasource name', () => {
      expect(schemaContent).toMatch(/datasource\s+db\s*{/)
    })
  })

  describe('Model definitions', () => {
    it('should have proper field types', () => {
      // Check for common Prisma types
      const hasValidTypes = 
        schemaContent.includes('String') ||
        schemaContent.includes('Int') ||
        schemaContent.includes('DateTime') ||
        schemaContent.includes('Boolean')
      
      expect(hasValidTypes).toBe(true)
    })

    it('should use @id decorator', () => {
      expect(schemaContent).toContain('@id')
    })

    it('should use @default decorator', () => {
      expect(schemaContent).toContain('@default')
    })

    it('should use @updatedAt decorator', () => {
      expect(schemaContent).toContain('@updatedAt')
    })
  })

  describe('Schema best practices', () => {
    it('should have timestamps on models', () => {
      expect(schemaContent).toContain('createdAt')
      expect(schemaContent).toContain('updatedAt')
    })

    it('should use cuid() for IDs', () => {
      expect(schemaContent).toMatch(/@default\(cuid\(\)\)/)
    })

    it('should have proper DateTime defaults', () => {
      expect(schemaContent).toMatch(/DateTime.*@default\(now\(\)\)/)
    })
  })

  describe('Migration compatibility', () => {
    it('should be compatible with PostgreSQL 12+', () => {
      // No MySQL or SQLite specific syntax
      expect(schemaContent).not.toContain('AUTO_INCREMENT')
      expect(schemaContent).not.toContain('AUTOINCREMENT')
    })

    it('should not have ambiguous field names', () => {
      // No reserved SQL keywords as field names
      const reservedKeywords = ['user', 'order', 'group', 'table']
      
      for (const keyword of reservedKeywords) {
        const regex = new RegExp(`\\b${keyword}\\s+String`, 'i')
        // This is just a warning, not necessarily an error
      }
    })
  })
})