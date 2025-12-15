import React from 'react'
import { render, screen } from '@testing-library/react'
import Layout from '@/app/(dashboard)/(rest)/layout'

// Mock the AppHeader component
jest.mock('@/components/app-header', () => ({
  AppHeader: () => <header data-testid="app-header">App Header</header>,
}))

describe('Rest Layout', () => {
  describe('Rendering', () => {
    it('should render the layout component', () => {
      const { container } = render(<Layout><div>Test Content</div></Layout>)
      
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render AppHeader component', () => {
      render(<Layout><div>Test Content</div></Layout>)
      
      expect(screen.getByTestId('app-header')).toBeInTheDocument()
    })

    it('should render children content', () => {
      render(<Layout><div>Test Content</div></Layout>)
      
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render main element', () => {
      const { container } = render(<Layout><div>Test Content</div></Layout>)
      
      expect(container.querySelector('main')).toBeInTheDocument()
    })

    it('should wrap content in main tag', () => {
      render(<Layout><div data-testid="test-content">Test Content</div></Layout>)
      const main = screen.getByRole('main')
      const content = screen.getByTestId('test-content')
      
      expect(main).toContainElement(content)
    })
  })

  describe('Layout Structure', () => {
    it('should render header before main content', () => {
      const { container } = render(<Layout><div>Content</div></Layout>)
      const elements = Array.from(container.firstChild!.childNodes)
      
      expect(elements[0]).toHaveAttribute('data-testid', 'app-header')
      expect((elements[1] as HTMLElement).tagName).toBe('MAIN')
    })

    it('should use React Fragment as root wrapper', () => {
      const { container } = render(<Layout><div>Content</div></Layout>)
      
      // Fragment doesn't add extra DOM nodes
      expect(container.childNodes.length).toBe(1)
    })

    it('should apply flex-1 class to main element', () => {
      const { container } = render(<Layout><div>Content</div></Layout>)
      const main = container.querySelector('main')
      
      expect(main).toHaveClass('flex-1')
    })

    it('should have proper semantic HTML structure', () => {
      const { container } = render(<Layout><div>Content</div></Layout>)
      
      expect(container.querySelector('header')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
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
            <section>Section 1</section>
            <section>Section 2</section>
            <article>Article Content</article>
          </div>
        </Layout>
      )
      
      expect(screen.getByText('Section 1')).toBeInTheDocument()
      expect(screen.getByText('Section 2')).toBeInTheDocument()
      expect(screen.getByText('Article Content')).toBeInTheDocument()
    })

    it('should handle empty children', () => {
      render(<Layout>{null}</Layout>)
      const main = screen.getByRole('main')
      
      expect(main).toBeInTheDocument()
      expect(main).toBeEmptyDOMElement()
    })

    it('should handle undefined children', () => {
      render(<Layout>{undefined}</Layout>)
      const main = screen.getByRole('main')
      
      expect(main).toBeInTheDocument()
      expect(main).toBeEmptyDOMElement()
    })

    it('should handle boolean children', () => {
      render(<Layout>{false}</Layout>)
      const main = screen.getByRole('main')
      
      expect(main).toBeInTheDocument()
      expect(main).toBeEmptyDOMElement()
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

    it('should accept array of elements as children', () => {
      expect(() => render(
        <Layout>
          {[
            <div key="1">Item 1</div>,
            <div key="2">Item 2</div>
          ]}
        </Layout>
      )).not.toThrow()
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

    it('should handle deeply nested children', () => {
      render(
        <Layout>
          <div>
            <div>
              <div>
                <div>
                  <span>Deeply Nested</span>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )
      
      expect(screen.getByText('Deeply Nested')).toBeInTheDocument()
    })

    it('should preserve child component state on re-render', () => {
      const ChildWithState = () => {
        const [count, setCount] = React.useState(0)
        return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      }
      
      const { rerender } = render(<Layout><ChildWithState /></Layout>)
      rerender(<Layout><ChildWithState /></Layout>)
      
      expect(screen.getByText(/Count:/)).toBeInTheDocument()
    })

    it('should handle very long content', () => {
      const longContent = 'Lorem ipsum '.repeat(1000)
      render(<Layout><div>{longContent}</div></Layout>)
      
      expect(screen.getByText(longContent)).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply flex-1 class to main element', () => {
      const { container } = render(<Layout><div>Content</div></Layout>)
      const main = container.querySelector('main')
      
      expect(main).toHaveClass('flex-1')
    })

    it('should not apply additional classes to children', () => {
      render(<Layout><div className="custom-class">Content</div></Layout>)
      const content = screen.getByText('Content')
      
      expect(content).toHaveClass('custom-class')
      expect(content).not.toHaveClass('flex-1')
    })

    it('should maintain child element classes', () => {
      render(
        <Layout>
          <div className="class1 class2 class3">Content</div>
        </Layout>
      )
      const content = screen.getByText('Content')
      
      expect(content).toHaveClass('class1', 'class2', 'class3')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure with header and main', () => {
      const { container } = render(<Layout><div>Content</div></Layout>)
      
      expect(container.querySelector('header')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
    })

    it('should use main role for content area', () => {
      render(<Layout><div>Main Content</div></Layout>)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should have only one main landmark', () => {
      render(<Layout><div>Content</div></Layout>)
      
      expect(screen.getAllByRole('main')).toHaveLength(1)
    })

    it('should allow nested interactive elements', () => {
      render(
        <Layout>
          <button>Button 1</button>
          <button>Button 2</button>
        </Layout>
      )
      
      expect(screen.getByText('Button 1')).toBeInTheDocument()
      expect(screen.getByText('Button 2')).toBeInTheDocument()
    })

    it('should maintain focus management', () => {
      render(
        <Layout>
          <input type="text" placeholder="Focus test" />
        </Layout>
      )
      
      expect(screen.getByPlaceholderText('Focus test')).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should render AppHeader and content together', () => {
      render(<Layout><div>Page Content</div></Layout>)
      
      expect(screen.getByTestId('app-header')).toBeInTheDocument()
      expect(screen.getByText('Page Content')).toBeInTheDocument()
    })

    it('should maintain proper DOM hierarchy', () => {
      const { container } = render(<Layout><div id="test-content">Content</div></Layout>)
      
      const main = container.querySelector('main')
      const content = container.querySelector('#test-content')
      
      expect(main).toContainElement(content!)
    })

    it('should work with complex page structures', () => {
      render(
        <Layout>
          <div className="page-container">
            <aside>Sidebar</aside>
            <section>Main Section</section>
            <footer>Footer</footer>
          </div>
        </Layout>
      )
      
      expect(screen.getByText('Sidebar')).toBeInTheDocument()
      expect(screen.getByText('Main Section')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not re-render header when children change', () => {
      const { rerender } = render(<Layout><div>Content 1</div></Layout>)
      
      rerender(<Layout><div>Content 2</div></Layout>)
      
      expect(screen.getByTestId('app-header')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('should handle multiple children efficiently', () => {
      const children = Array.from({ length: 100 }, (_, i) => (
        <div key={i}>Item {i}</div>
      ))
      
      render(<Layout>{children}</Layout>)
      
      expect(screen.getByText('Item 0')).toBeInTheDocument()
      expect(screen.getByText('Item 99')).toBeInTheDocument()
    })
  })
})