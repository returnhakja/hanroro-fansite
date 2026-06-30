const withSerwistInit = require("@serwist/next").default;

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  turbopack: {},
  serverExternalPackages: ['isomorphic-dompurify', 'jsdom'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/hanroro-fansite-82e91.firebasestorage.app/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 이미지 업로드 지원
    },
  },
  // 보안 응답 헤더 (CSP는 외부 스크립트/styled-components 호환성 검토 후 별도 설계)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // 클릭재킹 방지
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // MIME 타입 스니핑 방지
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referer 정보 최소 노출
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 불필요한 브라우저 기능 차단
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // HTTPS 강제 (2년)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

module.exports = withSerwist(nextConfig);
