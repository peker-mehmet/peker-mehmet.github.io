/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Set basePath to your GitHub repo name when deploying
  // basePath: '/academic-website',
};

module.exports = nextConfig;
