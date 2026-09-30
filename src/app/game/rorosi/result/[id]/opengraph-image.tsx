import { ImageResponse } from 'next/og';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import LorosiResult from '@/lib/db/models/LorosiResult';

export const alt = '한로로 로로시 게임 결과';
export const size = { width: 1080, height: 1350 };
export const contentType = 'image/png';

const STATIC_TEXT = 'HANRORO로로시게임목표초차이님의기록HANRORO.CO.KR0123456789./';

async function loadKoreanFont(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl).then((res) => res.text());
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error('폰트를 불러올 수 없습니다');
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

function formatMs(ms: number): string {
  return (ms / 1000).toFixed(2);
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let nickname = '익명';
  let elapsedMs = 1111;
  let diffMs = 0;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await connectDB();
      const result = await LorosiResult.findById(id).lean();
      if (result) {
        nickname = result.nickname;
        elapsedMs = result.elapsedMs;
        diffMs = result.diffMs;
      }
    }
  } catch {
    // DB 조회 실패해도 기본 이미지는 반환
  }

  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await loadKoreanFont(STATIC_TEXT + nickname);
  } catch (error) {
    console.error('로로시 결과 공유 이미지용 폰트 로드 실패', error);
  }

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
              fontSize: 44,
              lineHeight: 1.3,
              margin: '52px 0 8px',
            }}
          >
            <div style={{ display: 'flex' }}>로로시 게임</div>
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: 'rgba(243,236,224,0.7)', marginBottom: 40 }}>
            목표 11.11초
          </div>

          <div style={{ display: 'flex', width: 64, height: 3, background: '#C9A96E', marginBottom: 40 }} />

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <div style={{ display: 'flex', fontSize: 140, fontWeight: 700 }}>{formatMs(elapsedMs)}</div>
              <div style={{ display: 'flex', fontSize: 48, color: 'rgba(243,236,224,0.55)' }}>초</div>
            </div>
            <div style={{ display: 'flex', fontSize: 32, marginTop: 16, color: '#DEC596' }}>
              목표와 {formatMs(diffMs)}초 차이
            </div>
            <div style={{ display: 'flex', fontSize: 30, marginTop: 24 }}>{nickname}님의 기록</div>
          </div>

          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: 'rgba(243,236,224,0.55)' }}>
            HANRORO.CO.KR
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Noto Sans KR', data: fontData, style: 'normal', weight: 700 }]
        : [],
    }
  );
}
