import type { NextConfig } from 'next';

// GitHub Pages project-site deployment lives under /lrj-properties-2.
// Keep the base path in the exported asset URLs so CSS, JS and images load correctly.
const repositoryBasePath = '/lrj-properties-2';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: repositoryBasePath,
  assetPrefix: `${repositoryBasePath}/`,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
