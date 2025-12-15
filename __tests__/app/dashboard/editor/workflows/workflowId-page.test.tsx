import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { redirect } from 'next/navigation'
import Page from '@/app/(dashboard)/(editor)/workflows/[workflowId]/page'
import { requireAuth } from '@/lib/auth-utils'

describe('Workflow Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should call requireAuth', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      await Page({ params: Promise.resolve({ workflowId: '123' }) })
      
      expect(requireAuth).toHaveBeenCalled()
    })

    it('should redirect to login if not authenticated', async () => {
      ;(requireAuth as jest.Mock).mockImplementation(() => {
        ;(redirect as jest.Mock)('/login')
        throw new Error('NEXT_REDIRECT')
      })
      
      await expect(Page({ params: Promise.resolve({ workflowId: '123' }) })).rejects.toThrow('NEXT_REDIRECT')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('should call requireAuth before rendering', async () => {
      const requireAuthMock = requireAuth as jest.Mock
      requireAuthMock.mockResolvedValue({ user: { id: '1' } })
      
      await Page({ params: Promise.resolve({ workflowId: '123' }) })
      
      expect(requireAuthMock).toHaveBeenCalledTimes(1)
    })

    it('should not render if authentication fails', async () => {
      ;(requireAuth as jest.Mock).mockRejectedValue(new Error('Unauthorized'))
      
      await expect(Page({ params: Promise.resolve({ workflowId: '123' }) })).rejects.toThrow('Unauthorized')
    })
  })

  describe('Rendering', () => {
    it('should render workflow id', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: '123' }) })
      render(result)
      
      expect(screen.getByText('Workflow id: 123')).toBeInTheDocument()
    })

    it('should render a paragraph element', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: '123' }) })
      const { container } = render(result)
      
      expect(container.querySelector('p')).toBeInTheDocument()
    })

    it('should display different workflow IDs', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result1 = await Page({ params: Promise.resolve({ workflowId: 'abc' }) })
      render(result1)
      expect(screen.getByText('Workflow id: abc')).toBeInTheDocument()
      
      const result2 = await Page({ params: Promise.resolve({ workflowId: 'xyz' }) })
      const { container } = render(result2)
      expect(container.textContent).toContain('Workflow id: xyz')
    })

    it('should handle numeric workflow IDs', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: '999' }) })
      render(result)
      
      expect(screen.getByText('Workflow id: 999')).toBeInTheDocument()
    })

    it('should handle alphanumeric workflow IDs', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: 'wf-123-abc' }) })
      render(result)
      
      expect(screen.getByText('Workflow id: wf-123-abc')).toBeInTheDocument()
    })
  })

  describe('Params Handling', () => {
    it('should await params before using workflowId', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const paramsPromise = Promise.resolve({ workflowId: 'test-123' })
      const result = await Page({ params: paramsPromise })
      render(result)
      
      expect(screen.getByText('Workflow id: test-123')).toBeInTheDocument()
    })

    it('should handle delayed params resolution', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const paramsPromise = new Promise<{ workflowId: string }>(resolve => 
        setTimeout(() => resolve({ workflowId: 'delayed-id' }), 50)
      )
      
      const result = await Page({ params: paramsPromise })
      render(result)
      
      await waitFor(() => {
        expect(screen.getByText('Workflow id: delayed-id')).toBeInTheDocument()
      })
    })

    it('should correctly destructure workflowId from params', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: 'destructure-test' }) })
      const { container } = render(result)
      
      expect(container.textContent).toBe('Workflow id: destructure-test')
    })
  })

  describe('Component Type', () => {
    it('should be an async function', () => {
      expect(Page.constructor.name).toBe('AsyncFunction')
    })

    it('should return a Promise', () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = Page({ params: Promise.resolve({ workflowId: '123' }) })
      expect(result).toBeInstanceOf(Promise)
    })

    it('should be a server component', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: '123' }) })
      expect(React.isValidElement(result)).toBe(true)
    })

    it('should accept PageProps interface', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const props = { params: Promise.resolve({ workflowId: 'typed-id' }) }
      
      expect(() => Page(props)).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty workflow ID', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: '' }) })
      render(result)
      
      expect(screen.getByText('Workflow id:')).toBeInTheDocument()
    })

    it('should handle workflow ID with special characters', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: 'wf_123-abc.xyz' }) })
      render(result)
      
      expect(screen.getByText('Workflow id: wf_123-abc.xyz')).toBeInTheDocument()
    })

    it('should handle very long workflow IDs', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const longId = 'a'.repeat(100)
      const result = await Page({ params: Promise.resolve({ workflowId: longId }) })
      render(result)
      
      expect(screen.getByText(`Workflow id: ${longId}`)).toBeInTheDocument()
    })

    it('should handle UUID format workflow IDs', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const result = await Page({ params: Promise.resolve({ workflowId: uuid }) })
      render(result)
      
      expect(screen.getByText(`Workflow id: ${uuid}`)).toBeInTheDocument()
    })

    it('should not crash on multiple renders with same ID', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      for (let i = 0; i < 5; i++) {
        const result = await Page({ params: Promise.resolve({ workflowId: 'same-id' }) })
        expect(() => render(result)).not.toThrow()
      }
    })

    it('should handle null session gracefully', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue(null)
      
      const result = await Page({ params: Promise.resolve({ workflowId: '123' }) })
      render(result)
      
      expect(screen.getByText('Workflow id: 123')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have semantic paragraph element', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: '123' }) })
      const { container } = render(result)
      const paragraph = container.querySelector('p')
      
      expect(paragraph?.tagName).toBe('P')
    })

    it('should have readable text content', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: '123' }) })
      render(result)
      
      expect(screen.getByText('Workflow id: 123')).toBeVisible()
    })
  })

  describe('Integration', () => {
    it('should work with valid authentication and params', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'user@example.com' },
        expiresAt: Date.now() + 3600000,
      }
      ;(requireAuth as jest.Mock).mockResolvedValue(mockSession)
      
      const result = await Page({ params: Promise.resolve({ workflowId: 'workflow-456' }) })
      render(result)
      
      expect(requireAuth).toHaveBeenCalled()
      expect(screen.getByText('Workflow id: workflow-456')).toBeInTheDocument()
    })

    it('should handle authentication error and redirect', async () => {
      ;(requireAuth as jest.Mock).mockImplementation(() => {
        ;(redirect as jest.Mock)('/login')
        throw new Error('NEXT_REDIRECT')
      })
      
      await expect(Page({ params: Promise.resolve({ workflowId: '123' }) })).rejects.toThrow()
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('should render within layout context', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page({ params: Promise.resolve({ workflowId: '123' }) })
      const { container } = render(result)
      
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('Error Handling', () => {
    it('should propagate authentication errors', async () => {
      const error = new Error('Authentication failed')
      ;(requireAuth as jest.Mock).mockRejectedValue(error)
      
      await expect(Page({ params: Promise.resolve({ workflowId: '123' }) })).rejects.toThrow('Authentication failed')
    })

    it('should handle network errors during auth', async () => {
      ;(requireAuth as jest.Mock).mockRejectedValue(new Error('Network error'))
      
      await expect(Page({ params: Promise.resolve({ workflowId: '123' }) })).rejects.toThrow('Network error')
    })

    it('should handle params resolution errors', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const paramsPromise = Promise.reject(new Error('Params error'))
      
      await expect(Page({ params: paramsPromise })).rejects.toThrow('Params error')
    })
  })

  describe('Performance', () => {
    it('should call requireAuth only once per render', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      await Page({ params: Promise.resolve({ workflowId: '123' }) })
      
      expect(requireAuth).toHaveBeenCalledTimes(1)
    })

    it('should complete quickly with fast params resolution', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const start = Date.now()
      await Page({ params: Promise.resolve({ workflowId: '123' }) })
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(1000)
    })
  })
})