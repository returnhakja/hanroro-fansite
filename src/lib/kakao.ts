/**
 * 카카오톡 공유 (JavaScript SDK)
 * - SDK를 동적으로 1회만 로드하고, NEXT_PUBLIC_KAKAO_JS_KEY로 init
 * - shareToKakao()로 Feed 템플릿 공유 (로그인/동의 불필요)
 *
 * 사용 전제: 카카오 디벨로퍼스 → 플랫폼 → Web 에 도메인(www.hanroro.co.kr, localhost:3000) 등록 필수
 */

// 카카오 SDK는 타입 패키지 없이 전역 window.Kakao로 접근
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Kakao?: any;
  }
}

const SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js";
const SITE_URL = "https://www.hanroro.co.kr";
// 한글 파일명은 인코딩해야 카카오 스크랩 시 안전
const DEFAULT_IMAGE = encodeURI(`${SITE_URL}/assets/한로로프로필사진.jpg`);

let loadPromise: Promise<any> | null = null;

/** SDK 스크립트를 1회만 동적 로드 */
function loadSdk(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("SSR 환경에서는 사용할 수 없습니다."));
  }
  if (window.Kakao) return Promise.resolve(window.Kakao);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.async = true;
    script.onload = () => resolve(window.Kakao);
    script.onerror = () => {
      loadPromise = null; // 다음 시도 가능하도록 초기화
      reject(new Error("카카오 SDK 로드에 실패했습니다."));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

/** SDK 로드 + init 보장. 키가 없으면 null 반환 */
export async function ensureKakao(): Promise<any | null> {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  if (!key) {
    console.warn("[kakao] NEXT_PUBLIC_KAKAO_JS_KEY가 설정되지 않았습니다.");
    return null;
  }
  const Kakao = await loadSdk();
  if (Kakao && !Kakao.isInitialized()) {
    Kakao.init(key);
  }
  return Kakao;
}

export interface KakaoShareParams {
  /** 공유 카드 제목 */
  title: string;
  /** 공유 카드 설명 (날짜·장소 등) */
  description?: string;
  /** 썸네일 이미지 URL (절대 경로). 없으면 기본 프로필 이미지 */
  imageUrl?: string;
  /** 사이트 내 경로. 예) /schedule?event=123 */
  path: string;
  /** 하단 버튼 라벨 */
  buttonTitle?: string;
}

/**
 * 공유 썸네일 URL 정규화
 * - 절대 http(s) URL → 그대로
 * - 사이트 내 상대경로(/api/...) → SITE_URL 붙여 절대화
 * - data URI·빈 값 등 카카오가 못 긁는 형식 → 기본 이미지
 */
function resolveImageUrl(imageUrl?: string): string {
  if (!imageUrl) return DEFAULT_IMAGE;
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/")) return `${SITE_URL}${imageUrl}`;
  return DEFAULT_IMAGE;
}

/** 카카오톡 Feed 공유 */
export async function shareToKakao({
  title,
  description,
  imageUrl,
  path,
  buttonTitle = "자세히 보기",
}: KakaoShareParams): Promise<void> {
  const Kakao = await ensureKakao();
  if (!Kakao) return;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const link = `${SITE_URL}${normalizedPath}`;

  Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title,
      description: description ?? "",
      imageUrl: resolveImageUrl(imageUrl),
      link: { mobileWebUrl: link, webUrl: link },
    },
    buttons: [
      {
        title: buttonTitle,
        link: { mobileWebUrl: link, webUrl: link },
      },
    ],
  });
}
