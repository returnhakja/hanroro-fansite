import { ImageResponse } from 'next/og';
import connectDB from '@/lib/db/mongoose';
import FavoriteSetlist from '@/lib/db/models/FavoriteSetlist';

export const alt = '내 최애 세트리스트';
export const size = { width: 1080, height: 1350 };
export const contentType = 'image/png';

const STATIC_TEXT = 'HANRORO나의최애세트리스트HANRORO.CO.KR0123456789';

// Noto Sans KR 전체(수천 글자)를 다 받으면 무거우니, 실제로 쓰는 글자만
// Google Fonts의 text= 서브셋 기능으로 요청해 필요한 만큼만 받는다.
async function loadKoreanFont(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl).then((res) => res.text());
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error('폰트를 불러올 수 없습니다');
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let songs: string[] = ['한로로'];
  try {
    await connectDB();
    const setlist = await FavoriteSetlist.findById(id).lean();
    if (setlist) songs = setlist.songs as string[];
  } catch {
    // DB 조회 실패해도 기본 이미지는 반환
  }

  const fontData = await loadKoreanFont(STATIC_TEXT + songs.join(''));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(165deg, #6B5740 0%, #2C2418 65%, #1E1810 100%)',
          color: '#F3ECE0',
          fontFamily: 'Noto Sans KR',
        }}
      >
        {/* 우상단 은은한 골드 글로우 */}
        <div
          style={{
            position: 'absolute',
            zIndex: -1,
            top: -140,
            right: -180,
            width: 640,
            height: 640,
            borderRadius: 9999,
            display: 'flex',
            background: 'radial-gradient(circle, rgba(201,169,110,0.32) 0%, rgba(201,169,110,0) 70%)',
          }}
        />

        {/* 배경 워드마크 텍스처 (사이트 로고 타이포를 크게 흐리게) */}
        <div
          style={{
            position: 'absolute',
            zIndex: -1,
            left: -70,
            bottom: 30,
            display: 'flex',
            fontSize: 250,
            fontWeight: 700,
            letterSpacing: 2,
            color: 'rgba(243,236,224,0.055)',
            transform: 'rotate(-7deg)',
          }}
        >
          HANRORO
        </div>

        {/* 실제 콘텐츠 */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            padding: '76px 64px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 10, color: '#DEC596' }}>
            H A N R O R O
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 56,
              lineHeight: 1.3,
              margin: '52px 0 28px',
            }}
          >
            <div style={{ display: 'flex' }}>나의 최애</div>
            <div style={{ display: 'flex' }}>세트리스트</div>
          </div>

          <div style={{ display: 'flex', width: 64, height: 3, background: '#C9A96E', marginBottom: 40 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, flex: 1 }}>
            {songs.slice(0, 14).map((title, index) => (
              <div key={title} style={{ display: 'flex', alignItems: 'baseline', gap: 20, fontSize: 32 }}>
                <div style={{ display: 'flex', color: '#DEC596', fontSize: 26, width: 44 }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div style={{ display: 'flex' }}>{title}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: 'rgba(243,236,224,0.55)' }}>
            HANRORO.CO.KR
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Noto Sans KR', data: fontData, style: 'normal', weight: 700 }],
    }
  );
}
