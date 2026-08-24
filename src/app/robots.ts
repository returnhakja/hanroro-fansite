import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /contact/ 는 뒤 슬래시가 있어야 문의 상세(/contact/[id])만 막고
        // 문의 작성 폼인 /contact 자체는 그대로 색인 허용됨
        disallow: ['/api/', '/upload/', '/admin/', '/mypage', '/contact/', '/~offline'],
      },
    ],
    sitemap: 'https://www.hanroro.co.kr/sitemap.xml',
  };
}
