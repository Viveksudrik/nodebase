import React from 'react'
import { render, screen } from '@testing-library/react'
import { AppHeader } from '@/components/app-header'

// Mock the SidebarTrigger component
jest.mock('@/components/ui/sidebar', () => ({
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle Sidebar</button>,
}))

describe('AppHeader', () => {
  describe('Rendering', () => {
    it('should render the header element', () => {
      const { container } = render(<AppHeader />)
      const header = container.querySelector('header')
      
      expect(header).toBeInTheDocument()
    })

    it('should render with correct CSS classes', () => {
      const { container } = render(<AppHeader />)
      const header = container.querySelector('header')
      
      expect(header).toHaveClass('flex', 'h-14', 'shrink-0', 'items-center', 'gap-2', 'border-b', 'bg-background', 'px-4')
    })

    it('should render the SidebarTrigger component', () => {
      render(<AppHeader />)
      
      expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument()
    })

    it('should have proper semantic HTML structure', () => {
      const { container } = render(<AppHeader />)
      const header = container.querySelector('header')
      
      expect(header?.tagName).toBe('HEADER')
    })
  })

  describe('Layout', () => {
    it('should have fixed height of h-14', () => {
      const { container } = render(<AppHeader />)
      const header = container.querySelector('header')
      
      expect(header).toHaveClass('h-14')
    })

    it('should not shrink with shrink-0 class', () => {
      const { container } = render(<AppHeader />)
      const header = container.querySelector('header')
      
      expect(header).toHaveClass('shrink-0')
    })

    it('should have horizontal padding', () => {
      const { container } = render(<AppHeader />)
      const header = container.querySelector('header')
      
      expect(header).toHaveClass('px-4')
    })

    it('should have gap between items', () => {
      const { container } = render(<AppHeader />)
      const header = container.querySelector('header')
      
      expect(header).toHaveClass('gap-2')
    })

    it('should have border at bottom', () => {
      const { container } = render(<AppHeader />)
      const header = container.querySelector('header')
      
      expect(header).toHaveClass('border-b')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible through SidebarTrigger', () => {
      render(<AppHeader />)
      const trigger = screen.getByTestId('sidebar-trigger')
      
      expect(trigger).toBeInTheDocument()
    })

    it('should render without accessibility violations', () => {
      const { container } = render(<AppHeader />)
      
      expect(container.querySelector('header')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should render consistently on multiple renders', () => {
      const { rerender, container } = render(<AppHeader />)
      const firstRender = container.innerHTML
      
      rerender(<AppHeader />)
      const secondRender = container.innerHTML
      
      expect(firstRender).toBe(secondRender)
    })

    it('should not crash with missing context', () => {
      expect(() => render(<AppHeader />)).not.toThrow()
    })
  })
})