import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { redirect } from 'next/navigation'
import Page from '@/app/(dashboard)/(rest)/credentials/page'
import { requireAuth } from '@/lib/auth-utils'

describe('Credentials Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should call requireAuth', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      await Page()
      
      expect(requireAuth).toHaveBeenCalled()
    })

    it('should redirect to login if not authenticated', async () => {
      ;(requireAuth as jest.Mock).mockImplementation(() => {
        ;(redirect as jest.Mock)('/login')
        throw new Error('NEXT_REDIRECT')
      })
      
      await expect(Page()).rejects.toThrow('NEXT_REDIRECT')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('should call requireAuth before rendering', async () => {
      const requireAuthMock = requireAuth as jest.Mock
      requireAuthMock.mockResolvedValue({ user: { id: '1' } })
      
      await Page()
      
      expect(requireAuthMock).toHaveBeenCalledTimes(1)
    })

    it('should not render if authentication fails', async () => {
      ;(requireAuth as jest.Mock).mockRejectedValue(new Error('Unauthorized'))
      
      await expect(Page()).rejects.toThrow('Unauthorized')
    })
  })

  describe('Rendering', () => {
    it('should render credentials text', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page()
      render(result)
      
      expect(screen.getByText('Credentials')).toBeInTheDocument()
    })

    it('should render a paragraph element', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page()
      const { container } = render(result)
      
      expect(container.querySelector('p')).toBeInTheDocument()
    })

    it('should render consistent content', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result1 = await Page()
      const { container: container1 } = render(result1)
      
      const result2 = await Page()
      const { container: container2 } = render(result2)
      
      expect(container1.innerHTML).toBe(container2.innerHTML)
    })

    it('should render plain text without extra markup', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page()
      const { container } = render(result)
      const paragraph = container.querySelector('p')
      
      expect(paragraph?.textContent).toBe('Credentials')
    })
  })

  describe('Component Type', () => {
    it('should be an async function', () => {
      expect(Page.constructor.name).toBe('AsyncFunction')
    })

    it('should return a Promise', () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = Page()
      expect(result).toBeInstanceOf(Promise)
    })

    it('should be a server component', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page()
      expect(React.isValidElement(result)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null session gracefully', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue(null)
      
      const result = await Page()
      render(result)
      
      expect(screen.getByText('Credentials')).toBeInTheDocument()
    })

    it('should handle session with additional data', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        expiresAt: Date.now() + 3600000,
      })
      
      const result = await Page()
      render(result)
      
      expect(screen.getByText('Credentials')).toBeInTheDocument()
    })

    it('should not crash on multiple renders', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      for (let i = 0; i < 5; i++) {
        const result = await Page()
        expect(() => render(result)).not.toThrow()
      }
    })

    it('should handle slow authentication', async () => {
      ;(requireAuth as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ user: { id: '1' } }), 100))
      )
      
      const result = await Page()
      render(result)
      
      await waitFor(() => {
        expect(screen.getByText('Credentials')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have semantic paragraph element', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page()
      const { container } = render(result)
      const paragraph = container.querySelector('p')
      
      expect(paragraph?.tagName).toBe('P')
    })

    it('should have readable text content', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page()
      render(result)
      
      expect(screen.getByText('Credentials')).toBeVisible()
    })
  })

  describe('Integration', () => {
    it('should work with valid authentication flow', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'user@example.com' },
        expiresAt: Date.now() + 3600000,
      }
      ;(requireAuth as jest.Mock).mockResolvedValue(mockSession)
      
      const result = await Page()
      render(result)
      
      expect(requireAuth).toHaveBeenCalled()
      expect(screen.getByText('Credentials')).toBeInTheDocument()
    })

    it('should handle authentication error and redirect', async () => {
      ;(requireAuth as jest.Mock).mockImplementation(() => {
        ;(redirect as jest.Mock)('/login')
        throw new Error('NEXT_REDIRECT')
      })
      
      await expect(Page()).rejects.toThrow()
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('should render within layout context', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const result = await Page()
      const { container } = render(result)
      
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('Error Handling', () => {
    it('should propagate authentication errors', async () => {
      const error = new Error('Authentication failed')
      ;(requireAuth as jest.Mock).mockRejectedValue(error)
      
      await expect(Page()).rejects.toThrow('Authentication failed')
    })

    it('should handle network errors during auth', async () => {
      ;(requireAuth as jest.Mock).mockRejectedValue(new Error('Network error'))
      
      await expect(Page()).rejects.toThrow('Network error')
    })

    it('should handle timeout errors', async () => {
      ;(requireAuth as jest.Mock).mockRejectedValue(new Error('Request timeout'))
      
      await expect(Page()).rejects.toThrow('Request timeout')
    })
  })

  describe('Performance', () => {
    it('should call requireAuth only once per render', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      await Page()
      
      expect(requireAuth).toHaveBeenCalledTimes(1)
    })

    it('should complete authentication quickly', async () => {
      ;(requireAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } })
      
      const start = Date.now()
      await Page()
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(1000)
    })
  })
})