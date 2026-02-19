/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 도커 환경에서 standalone 모드로 빌드 최적화 */
  output: "standalone",
  images: {
    /* 외부 이미지 도메인 허용 (Unsplash + 로컬 업로드) */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  /* Server Actions 파일 크기 제한 (이미지 업로드용) */
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
