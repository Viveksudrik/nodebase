import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  redirect: jest.fn(),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// Mock auth client
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    signOut: jest.fn(),
  },
}))

// Mock auth utilities
jest.mock('@/lib/auth-utils', () => ({
  requireAuth: jest.fn(),
  requireUnauth: jest.fn(),
}))

// Mock headers
jest.mock('next/headers', () => ({
  headers: jest.fn(() => Promise.resolve(new Headers())),
}))

// Mock the sidebar hook
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: jest.fn(() => false),
}))

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}