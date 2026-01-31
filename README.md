# 🌟 HANRORO FANSITE

한로로 팬들을 위한 비공식 커뮤니티 사이트입니다.
이미지를 업로드하고, 갤러리에서 팬 콘텐츠를 공유하며, 팬들끼리 소통할 수 있는 공간을 제공합니다.

---

## 📸 주요 기능

- **갤러리 보기**: 팬들이 업로드한 한로로 이미지들을 모아볼 수 있어요
- **이미지 업로드**: 제목과 함께 이미지를 업로드하여 팬들과 공유할 수 있어요
- **확대 보기**: 갤러리 이미지를 클릭하면 크게 볼 수 있어요
- **게시판**: 팬들끼리 자유롭게 소통할 수 있는 게시판
- **아티스트 프로필**: 한로로의 YouTube 영상 및 일정 확인

---

## 🛠️ 기술 스택

| Frontend | Backend | Database & Storage |
|----------|---------|-------------------|
| Next.js 16 (App Router) | Next.js API Routes | MongoDB Atlas |
| React 19 + TypeScript | | Vercel Blob |
| styled-components | | Firebase Storage (기존) |

**패키지 매니저:** pnpm 10.28.2
**배포:** Vercel

---

## 🚀 프로젝트 실행 방법

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id

# Firebase (기존 이미지용)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app

# JWT
JWT_SECRET=your-jwt-secret-here

# Admin (시드 스크립트용)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=관리자
```

### 2. 개발 서버 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 3. 관리자 계정 생성 (최초 1회)

```bash
pnpm seed:admin
```

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 페이지
│   └── api/                    # API Routes
│       ├── upload/             # 이미지 업로드
│       ├── images/             # 이미지 목록/랜덤
│       ├── image/[id]/         # 이미지 삭제
│       ├── board/              # 게시판 CRUD
│       └── youtube/videos/     # YouTube API
├── components/
│   ├── providers/              # SSR, 로딩 Provider
│   ├── layout/                 # Header, Footer
│   └── features/               # 기능별 컴포넌트
├── lib/
│   ├── db/                     # MongoDB 연결, 모델
│   ├── storage/                # Vercel Blob 유틸
│   └── utils/                  # 유틸리티 함수
└── data/                       # 정적 데이터
```

---

## 🔗 API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|----------|--------|------|
| `/api/upload` | POST | 이미지 업로드 (Vercel Blob) |
| `/api/images` | GET | 이미지 목록 |
| `/api/images/random` | GET | 랜덤 이미지 |
| `/api/image/[id]` | DELETE | 이미지 삭제 |
| `/api/board` | GET/POST | 게시글 목록/작성 |
| `/api/board/[id]` | GET/DELETE | 게시글 조회/삭제 |
| `/api/board/[id]/like` | POST | 좋아요 |
| `/api/youtube/videos` | GET | YouTube 영상 목록 |

---

## 🎯 마이그레이션 상태

### ✅ 완료
- Next.js 16 + App Router 설정
- styled-components SSR 구성
- MongoDB + Mongoose TypeScript 모델
- Vercel Blob 통합
- 모든 API Routes 마이그레이션

### 🚧 진행 필요
- CRA 페이지 → Next.js App Router 페이지 마이그레이션
- react-router-dom → Next.js Link/Router 변환

---

## 📦 배포

Vercel로 배포합니다. 자세한 내용은 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)를 참고하세요.

```bash
# Vercel CLI 사용
vercel           # 미리보기 배포
vercel --prod    # 프로덕션 배포
```

---

## 📝 라이선스

이 프로젝트는 개인 학습 및 팬 커뮤니티 목적으로 제작되었습니다.
