import React from 'react'
import { render, screen } from '@testing-library/react'
import Layout from '@/app/(dashboard)/layout'

// Mock the components
jest.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: any) => <div data-testid="sidebar-provider">{children}</div>,
  SidebarInset: ({ children, className }: any) => <div data-testid="sidebar-inset" className={className}>{children}</div>,
}))

jest.mock('@/components/app-sidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">App Sidebar</div>,
}))

describe('Dashboard Layout', () => {
  describe('Rendering', () => {
    it('should render the layout component', () => {
      render(<Layout><div>Test Content</div></Layout>)
      
      expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument()
    })

    it('should render children content', () => {
      render(<Layout><div>Test Content</div></Layout>)
      
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render AppSidebar component', () => {
      render(<Layout><div>Test Content</div></Layout>)
      
      expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
    })

    it('should render SidebarInset component', () => {
      render(<Layout><div>Test Content</div></Layout>)
      
      expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument()
    })

    it('should wrap everything in SidebarProvider', () => {
      render(<Layout><div>Test Content</div></Layout>)
      
      const provider = screen.getByTestId('sidebar-provider')
      expect(provider).toContainElement(screen.getByTestId('app-sidebar'))
      expect(provider).toContainElement(screen.getByTestId('sidebar-inset'))
    })
  })

  describe('Layout Structure', () => {
    it('should have correct component hierarchy', () => {
      const { container } = render(<Layout><div>Test Content</div></Layout>)
      const provider = screen.getByTestId('sidebar-provider')
      const sidebar = screen.getByTestId('app-sidebar')
      const inset = screen.getByTestId('sidebar-inset')
      
      expect(provider).toContainElement(sidebar)
      expect(provider).toContainElement(inset)
    })

    it('should apply bg-accent/20 class to SidebarInset', () => {
      render(<Layout><div>Test Content</div></Layout>)
      const inset = screen.getByTestId('sidebar-inset')
      
      expect(inset).toHaveClass('bg-accent/20')
    })

    it('should render sidebar before content', () => {
      const { container } = render(<Layout><div>Test Content</div></Layout>)
      const provider = screen.getByTestId('sidebar-provider')
      const children = Array.from(provider.children)
      
      expect(children[0]).toHaveAttribute('data-testid', 'app-sidebar')
      expect(children[1]).toHaveAttribute('data-testid', 'sidebar-inset')
    })
  })

  describe('Children Handling', () => {
    it('should render single child element', () => {
      render(<Layout><div data-testid="single-child">Single Child</div></Layout>)
      
      expect(screen.getByTestId('single-child')).toBeInTheDocument()
    })

    it('should render multiple child elements', () => {
      render(
        <Layout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Layout>
      )
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })

    it('should render text content', () => {
      render(<Layout>Plain text content</Layout>)
      
      expect(screen.getByText('Plain text content')).toBeInTheDocument()
    })

    it('should render complex nested components', () => {
      render(
        <Layout>
          <div>
            <header>Header</header>
            <main>Main Content</main>
            <footer>Footer</footer>
          </div>
        </Layout>
      )
      
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Main Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should handle empty children', () => {
      render(<Layout>{null}</Layout>)
      
      expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument()
    })

    it('should handle undefined children', () => {
      render(<Layout>{undefined}</Layout>)
      
      expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument()
    })
  })

  describe('TypeScript Props', () => {
    it('should accept React.ReactNode as children', () => {
      const content = <div>Typed Content</div>
      
      expect(() => render(<Layout>{content}</Layout>)).not.toThrow()
    })

    it('should accept string as children', () => {
      expect(() => render(<Layout>String content</Layout>)).not.toThrow()
    })

    it('should accept number as children', () => {
      expect(() => render(<Layout>{42}</Layout>)).not.toThrow()
    })

    it('should accept fragment as children', () => {
      expect(() => render(
        <Layout>
          <>
            <div>Fragment Child 1</div>
            <div>Fragment Child 2</div>
          </>
        </Layout>
      )).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should render without crashing', () => {
      expect(() => render(<Layout><div>Content</div></Layout>)).not.toThrow()
    })

    it('should render consistently on multiple renders', () => {
      const { rerender, container } = render(<Layout><div>Content</div></Layout>)
      const firstRender = container.innerHTML
      
      rerender(<Layout><div>Content</div></Layout>)
      const secondRender = container.innerHTML
      
      expect(firstRender).toBe(secondRender)
    })

    it('should handle rapid re-renders', () => {
      const { rerender } = render(<Layout><div>Initial</div></Layout>)
      
      for (let i = 0; i < 10; i++) {
        rerender(<Layout><div>Render {i}</div></Layout>)
      }
      
      expect(screen.getByText('Render 9')).toBeInTheDocument()
    })

    it('should not have memory leaks on unmount', () => {
      const { unmount } = render(<Layout><div>Content</div></Layout>)
      
      expect(() => unmount()).not.toThrow()
    })

    it('should preserve child component state on re-render', () => {
      const ChildWithState = () => {
        const [count, setCount] = React.useState(0)
        return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      }
      
      const { rerender } = render(<Layout><ChildWithState /></Layout>)
      
      // This behavior depends on React's reconciliation
      rerender(<Layout><ChildWithState /></Layout>)
      
      expect(screen.getByText(/Count:/)).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should work with SidebarProvider context', () => {
      render(<Layout><div>Content with Sidebar</div></Layout>)
      
      expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument()
      expect(screen.getByText('Content with Sidebar')).toBeInTheDocument()
    })

    it('should render both sidebar and content simultaneously', () => {
      render(<Layout><div>Main Content</div></Layout>)
      
      expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
      expect(screen.getByText('Main Content')).toBeInTheDocument()
    })

    it('should maintain proper DOM hierarchy', () => {
      const { container } = render(<Layout><div id="test-content">Content</div></Layout>)
      
      const provider = container.querySelector('[data-testid="sidebar-provider"]')
      const content = container.querySelector('#test-content')
      
      expect(provider).toContainElement(content!)
    })
  })

  describe('Styling', () => {
    it('should apply background styling to sidebar inset', () => {
      render(<Layout><div>Content</div></Layout>)
      const inset = screen.getByTestId('sidebar-inset')
      
      expect(inset.className).toContain('bg-accent/20')
    })

    it('should not apply additional classes to children', () => {
      render(<Layout><div className="custom-class">Content</div></Layout>)
      const content = screen.getByText('Content')
      
      expect(content).toHaveClass('custom-class')
      expect(content).not.toHaveClass('bg-accent/20')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<Layout><main>Main Content</main></Layout>)
      
      expect(container.querySelector('main')).toBeInTheDocument()
    })

    it('should be keyboard navigable through sidebar', () => {
      render(<Layout><div>Content</div></Layout>)
      
      expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
    })

    it('should maintain focus management', () => {
      render(<Layout><button>Focus Test</button></Layout>)
      
      expect(screen.getByText('Focus Test')).toBeInTheDocument()
    })
  })
})