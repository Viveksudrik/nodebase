import nextConfig from '../../next.config'

describe('next.config.ts', () => {
  describe('Configuration', () => {
    it('should have devIndicators disabled', () => {
      expect(nextConfig.devIndicators).toBe(false)
    })

    it('should have redirects function defined', () => {
      expect(nextConfig.redirects).toBeDefined()
      expect(typeof nextConfig.redirects).toBe('function')
    })
  })

  describe('Redirects', () => {
    it('should redirect root path to /workflows', async () => {
      const redirects = await nextConfig.redirects!()
      
      expect(redirects).toHaveLength(1)
      expect(redirects[0]).toEqual({
        source: '/',
        destination: '/workflows',
        permanent: false,
      })
    })

    it('should return an array of redirects', async () => {
      const redirects = await nextConfig.redirects!()
      
      expect(Array.isArray(redirects)).toBe(true)
    })

    it('should have non-permanent redirect', async () => {
      const redirects = await nextConfig.redirects!()
      
      expect(redirects[0].permanent).toBe(false)
    })

    it('should redirect from exact root path', async () => {
      const redirects = await nextConfig.redirects!()
      
      expect(redirects[0].source).toBe('/')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty configuration gracefully', () => {
      expect(nextConfig).toBeDefined()
      expect(typeof nextConfig).toBe('object')
    })

    it('should not have undefined required properties', () => {
      expect(nextConfig.redirects).not.toBeUndefined()
      expect(nextConfig.devIndicators).not.toBeUndefined()
    })
  })
})