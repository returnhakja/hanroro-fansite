/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true, // styled-components SSR 지원
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/hanroro-fansite-82e91.firebasestorage.app/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 이미지 업로드 지원
    },
  },
};

module.exports = nextConfig;
