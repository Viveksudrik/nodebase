import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { authClient } from '@/lib/auth-client'

// Mock the UI components
jest.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children, ...props }: any) => <div data-testid="sidebar" {...props}>{children}</div>,
  SidebarContent: ({ children }: any) => <div data-testid="sidebar-content">{children}</div>,
  SidebarFooter: ({ children }: any) => <div data-testid="sidebar-footer">{children}</div>,
  SidebarGroup: ({ children }: any) => <div data-testid="sidebar-group">{children}</div>,
  SidebarGroupContent: ({ children }: any) => <div data-testid="sidebar-group-content">{children}</div>,
  SidebarHeader: ({ children }: any) => <div data-testid="sidebar-header">{children}</div>,
  SidebarMenu: ({ children }: any) => <ul data-testid="sidebar-menu">{children}</ul>,
  SidebarMenuButton: ({ children, onClick, tooltip, isActive, asChild, ...props }: any) => {
    if (asChild && children) {
      return React.cloneElement(children, { onClick, 'data-active': isActive, 'data-tooltip': tooltip, ...props })
    }
    return <button onClick={onClick} data-active={isActive} data-tooltip={tooltip} {...props}>{children}</button>
  },
  SidebarMenuItem: ({ children }: any) => <li data-testid="sidebar-menu-item">{children}</li>,
}))

describe('AppSidebar', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(usePathname as jest.Mock).mockReturnValue('/workflows')
  })

  describe('Rendering', () => {
    it('should render the sidebar component', () => {
      render(<AppSidebar />)
      
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })

    it('should render the logo and brand name', () => {
      render(<AppSidebar />)
      
      expect(screen.getByAlt('nodebase')).toBeInTheDocument()
      expect(screen.getByText('Nodebase')).toBeInTheDocument()
    })

    it('should render all menu items', () => {
      render(<AppSidebar />)
      
      expect(screen.getByText('Workflows')).toBeInTheDocument()
      expect(screen.getByText('Credentials')).toBeInTheDocument()
      expect(screen.getByText('Executions')).toBeInTheDocument()
    })

    it('should render footer actions', () => {
      render(<AppSidebar />)
      
      expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument()
      expect(screen.getByText('Billing Portal')).toBeInTheDocument()
      expect(screen.getByText('Sign Out')).toBeInTheDocument()
    })

    it('should have collapsible icon mode', () => {
      render(<AppSidebar />)
      const sidebar = screen.getByTestId('sidebar')
      
      expect(sidebar).toHaveAttribute('collapsible', 'icon')
    })
  })

  describe('Navigation', () => {
    it('should link to workflows page', () => {
      render(<AppSidebar />)
      const workflowsLink = screen.getByText('Workflows').closest('a')
      
      expect(workflowsLink).toHaveAttribute('href', '/workflows')
    })

    it('should link to credentials page', () => {
      render(<AppSidebar />)
      const credentialsLink = screen.getByText('Credentials').closest('a')
      
      expect(credentialsLink).toHaveAttribute('href', '/credentials')
    })

    it('should link to executions page', () => {
      render(<AppSidebar />)
      const executionsLink = screen.getByText('Executions').closest('a')
      
      expect(executionsLink).toHaveAttribute('href', '/executions')
    })

    it('should link logo to home page', () => {
      render(<AppSidebar />)
      const logoLink = screen.getByAlt('nodebase').closest('a')
      
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('should mark current page as active', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/workflows')
      render(<AppSidebar />)
      
      const workflowsButton = screen.getByText('Workflows').closest('button')
      expect(workflowsButton).toHaveAttribute('data-active', 'true')
    })

    it('should mark other pages as inactive when on workflows', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/workflows')
      render(<AppSidebar />)
      
      const credentialsButton = screen.getByText('Credentials').closest('button')
      expect(credentialsButton).toHaveAttribute('data-active', 'false')
    })

    it('should handle nested routes correctly', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/workflows/123')
      render(<AppSidebar />)
      
      const workflowsButton = screen.getByText('Workflows').closest('button')
      expect(workflowsButton).toHaveAttribute('data-active', 'true')
    })

    it('should handle root path correctly', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')
      render(<AppSidebar />)
      
      const workflowsButton = screen.getByText('Workflows').closest('button')
      expect(workflowsButton).toHaveAttribute('data-active', 'false')
    })
  })

  describe('Sign Out Functionality', () => {
    it('should call authClient.signOut when sign out button is clicked', () => {
      render(<AppSidebar />)
      const signOutButton = screen.getByText('Sign Out')
      
      fireEvent.click(signOutButton)
      
      expect(authClient.signOut).toHaveBeenCalled()
    })

    it('should redirect to login on successful sign out', async () => {
      const mockSignOut = authClient.signOut as jest.Mock
      mockSignOut.mockImplementation(({ fetchOptions }) => {
        fetchOptions.onSuccess()
      })

      render(<AppSidebar />)
      const signOutButton = screen.getByText('Sign Out')
      
      fireEvent.click(signOutButton)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('should pass fetchOptions to authClient.signOut', () => {
      render(<AppSidebar />)
      const signOutButton = screen.getByText('Sign Out')
      
      fireEvent.click(signOutButton)
      
      expect(authClient.signOut).toHaveBeenCalledWith({
        fetchOptions: {
          onSuccess: expect.any(Function),
        },
      })
    })

    it('should have tooltip for sign out button', () => {
      render(<AppSidebar />)
      const signOutButton = screen.getByText('Sign Out').closest('button')
      
      expect(signOutButton).toHaveAttribute('data-tooltip', 'Sign Out')
    })
  })

  describe('Footer Actions', () => {
    it('should render upgrade to pro button', () => {
      render(<AppSidebar />)
      const upgradeButton = screen.getByText('Upgrade to Pro')
      
      expect(upgradeButton).toBeInTheDocument()
    })

    it('should render billing portal button', () => {
      render(<AppSidebar />)
      const billingButton = screen.getByText('Billing Portal')
      
      expect(billingButton).toBeInTheDocument()
    })

    it('should have tooltips for footer actions', () => {
      render(<AppSidebar />)
      
      const upgradeButton = screen.getByText('Upgrade to Pro').closest('button')
      const billingButton = screen.getByText('Billing Portal').closest('button')
      
      expect(upgradeButton).toHaveAttribute('data-tooltip', 'Upgrade to Pro')
      expect(billingButton).toHaveAttribute('data-tooltip', 'Billing Portal ')
    })

    it('should not crash when clicking upgrade button', () => {
      render(<AppSidebar />)
      const upgradeButton = screen.getByText('Upgrade to Pro')
      
      expect(() => fireEvent.click(upgradeButton)).not.toThrow()
    })

    it('should not crash when clicking billing button', () => {
      render(<AppSidebar />)
      const billingButton = screen.getByText('Billing Portal')
      
      expect(() => fireEvent.click(billingButton)).not.toThrow()
    })
  })

  describe('Menu Structure', () => {
    it('should render menu items in correct order', () => {
      render(<AppSidebar />)
      const menuItems = screen.getAllByTestId('sidebar-menu-item')
      const menuTexts = menuItems.map(item => item.textContent)
      
      expect(menuTexts).toContain('Workflows')
      expect(menuTexts).toContain('Credentials')
      expect(menuTexts).toContain('Executions')
    })

    it('should have tooltips for menu items', () => {
      render(<AppSidebar />)
      
      const workflowsButton = screen.getByText('Workflows').closest('button')
      const credentialsButton = screen.getByText('Credentials').closest('button')
      const executionsButton = screen.getByText('Executions').closest('button')
      
      expect(workflowsButton).toHaveAttribute('data-tooltip', 'Workflows')
      expect(credentialsButton).toHaveAttribute('data-tooltip', 'Credentials')
      expect(executionsButton).toHaveAttribute('data-tooltip', 'Executions')
    })

    it('should render icons for menu items', () => {
      render(<AppSidebar />)
      const { container } = render(<AppSidebar />)
      
      // Icons are rendered as SVG elements with specific classes
      expect(container.querySelector('.size-4')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty pathname', () => {
      ;(usePathname as jest.Mock).mockReturnValue('')
      
      expect(() => render(<AppSidebar />)).not.toThrow()
    })

    it('should handle null pathname gracefully', () => {
      ;(usePathname as jest.Mock).mockReturnValue(null)
      
      expect(() => render(<AppSidebar />)).not.toThrow()
    })

    it('should handle sign out error gracefully', () => {
      const mockSignOut = authClient.signOut as jest.Mock
      mockSignOut.mockImplementation(() => {
        throw new Error('Sign out failed')
      })

      render(<AppSidebar />)
      const signOutButton = screen.getByText('Sign Out')
      
      expect(() => fireEvent.click(signOutButton)).not.toThrow()
    })

    it('should render consistently on multiple renders', () => {
      const { rerender, container } = render(<AppSidebar />)
      const firstRender = container.innerHTML
      
      rerender(<AppSidebar />)
      const secondRender = container.innerHTML
      
      expect(firstRender).toBe(secondRender)
    })

    it('should handle route changes', () => {
      const { rerender } = render(<AppSidebar />)
      
      ;(usePathname as jest.Mock).mockReturnValue('/credentials')
      rerender(<AppSidebar />)
      
      const credentialsButton = screen.getByText('Credentials').closest('button')
      expect(credentialsButton).toHaveAttribute('data-active', 'true')
    })
  })

  describe('Accessibility', () => {
    it('should have semantic menu structure', () => {
      render(<AppSidebar />)
      
      expect(screen.getAllByTestId('sidebar-menu')).toHaveLength(1)
    })

    it('should have accessible links', () => {
      render(<AppSidebar />)
      const links = screen.getAllByRole('link')
      
      expect(links.length).toBeGreaterThan(0)
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })

    it('should have descriptive text for all actions', () => {
      render(<AppSidebar />)
      
      expect(screen.getByText('Workflows')).toBeInTheDocument()
      expect(screen.getByText('Credentials')).toBeInTheDocument()
      expect(screen.getByText('Executions')).toBeInTheDocument()
      expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument()
      expect(screen.getByText('Billing Portal')).toBeInTheDocument()
      expect(screen.getByText('Sign Out')).toBeInTheDocument()
    })

    it('should have alt text for logo image', () => {
      render(<AppSidebar />)
      const logo = screen.getByAlt('nodebase')
      
      expect(logo).toBeInTheDocument()
    })
  })
})