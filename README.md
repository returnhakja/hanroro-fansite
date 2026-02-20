# 🌟 HANRORO FANSITE

한로로 팬들을 위한 비공식 커뮤니티 사이트입니다.
이미지를 업로드하고, 갤러리에서 팬 콘텐츠를 공유하며, 팬들끼리 소통할 수 있는 공간을 제공합니다.

---

## 📸 주요 기능

- **갤러리**: 팬들이 업로드한 한로로 이미지들을 모아볼 수 있어요 (모달 확대 보기)
- **일정 페이지**: 다가오는 공연 D-day 카드 + 전체 캘린더로 일정 확인
- **셋리스트 페이지**: 모든 공연의 셋리스트를 Day별 탭으로 확인 (단독콘서트: Day1/Day2, 페스티벌: Day1)
- **게시판**: 팬들끼리 자유롭게 소통할 수 있는 게시판 (댓글/대댓글 지원)
- **YouTube 영상**: 최신 YouTube 영상 목록 (YouTube Data API 연동)
- **관리자 대시보드**: 공연/일정/이미지 관리 기능 (JWT 인증)

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
│   ├── page.tsx                # 홈 페이지 (프리뷰 섹션)
│   ├── gallery/                # 갤러리 페이지
│   ├── schedule/               # 일정 페이지 (D-day + 캘린더)
│   ├── setlist/                # 셋리스트 페이지
│   ├── profile/                # 프로필 페이지
│   ├── board/                  # 게시판 페이지
│   ├── admin/                  # 관리자 대시보드
│   └── api/                    # API Routes
│       ├── concerts/           # 공연 목록 (공개)
│       ├── events/             # 일정 목록 (공개)
│       ├── upload/             # 이미지 업로드
│       ├── images/             # 이미지 목록/랜덤
│       ├── board/              # 게시판 CRUD
│       ├── youtube/            # YouTube API
│       └── admin/              # 관리자 API
├── components/
│   ├── providers/              # SSR, 로딩 Provider
│   ├── layout/                 # Header, Footer
│   ├── features/board/         # 게시판 컴포넌트
│   ├── seo/                    # StructuredData
│   ├── ui/                     # 공통 UI
│   ├── EventCalendar.tsx       # 이벤트 캘린더
│   └── ImageUploader.tsx       # 이미지 업로더
├── lib/
│   ├── db/                     # MongoDB 연결, 모델
│   ├── auth/                   # JWT 인증
│   ├── storage/                # 파일 스토리지
│   └── utils/                  # 유틸리티 함수
├── styles/                     # 글로벌 스타일
└── hooks/                      # 커스텀 훅
```

---

## 🔗 API 엔드포인트

### 공개 API
| 엔드포인트 | 메서드 | 설명 |
|----------|--------|------|
| `/api/concerts` | GET | 모든 공연 + 셋리스트 목록 |
| `/api/events/upcoming` | GET | 다가오는 일정 (isPinned 포함) |
| `/api/youtube/videos` | GET | YouTube 영상 목록 |
| `/api/images` | GET | 갤러리 이미지 목록 |
| `/api/images/random` | GET | 랜덤 이미지 |
| `/api/upload` | POST | 이미지 업로드 (Vercel Blob) |
| `/api/board` | GET/POST | 게시글 목록/작성 |
| `/api/board/[id]` | GET/DELETE | 게시글 조회/삭제 |
| `/api/board/[id]/like` | POST | 좋아요 |
| `/api/board/[id]/comments` | GET/POST | 댓글 목록/작성 |

### 관리자 전용 API (JWT 필수)
| 엔드포인트 | 메서드 | 설명 |
|----------|--------|------|
| `/api/admin/concerts` | GET/POST/PUT/DELETE | 공연 관리 |
| `/api/admin/setlists` | GET/POST/PUT/DELETE | 셋리스트 관리 |
| `/api/admin/events` | GET/POST/PUT/DELETE | 일정 관리 |
| `/api/admin/login` | POST | 관리자 로그인 (JWT 발급) |

---

## 🎯 마이그레이션 상태

### ✅ 완료
- Next.js 16 + App Router 설정
- styled-components SSR 구성
- MongoDB + Mongoose TypeScript 모델
- Vercel Blob 통합
- 모든 API Routes 마이그레이션
- 모든 페이지 App Router로 마이그레이션 완료
- 일정(/schedule) 및 셋리스트(/setlist) 전용 페이지 분리
- framer-motion 애니메이션 적용
- 게시판 댓글/대댓글 기능 추가

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
