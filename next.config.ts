import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      }
    ]
  }
}

if (isGithubPages) {
  const pagesBasePath = '/belkhidmah-landing-page'
  process.env.NEXT_PUBLIC_BASE_PATH = pagesBasePath
  nextConfig.output = 'export'
  nextConfig.trailingSlash = true
  nextConfig.basePath = pagesBasePath
}

export default withNextIntl(nextConfig)
