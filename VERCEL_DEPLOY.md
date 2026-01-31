# Vercel 배포 가이드

## 1. 사전 준비

### ✅ 완료된 작업
- [x] Next.js 16 마이그레이션
- [x] 모든 API Routes 통합 (`src/app/api/`)
- [x] TypeScript 에러 수정
- [x] 빌드 테스트 성공

### 📦 레거시 파일 정리
- `server-legacy/` - 구 Express 서버 (사용 안 함)
- `src/pages-legacy/` - 구 CRA 페이지 (참고용)
- `src/*.legacy` - 구 CRA 엔트리 파일 (사용 안 함)

## 2. Vercel 배포 방법

### Option 1: Vercel CLI (권장)

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 배포 (미리보기)
vercel

# 4. 프로덕션 배포
vercel --prod
```

### Option 2: Vercel Dashboard (웹)

1. [vercel.com](https://vercel.com) 접속
2. **Add New Project** 클릭
3. GitHub 저장소 연결
4. 프로젝트 선택: `HANRORO-FANSITE`
5. **Framework Preset**: Next.js (자동 감지)
6. **Build Command**: `pnpm build` (자동 설정)
7. **Deploy** 클릭

## 3. 환경 변수 설정

Vercel Dashboard에서 다음 환경 변수를 설정:

### 필수 환경 변수

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

### Vercel Blob (자동 생성)
- `BLOB_READ_WRITE_TOKEN` - Vercel이 자동으로 생성

**설정 방법:**
1. Vercel Dashboard > 프로젝트 선택
2. **Settings** > **Environment Variables**
3. 각 변수 추가 후 **Save**

## 4. 도메인 설정

### 기본 도메인
- Vercel이 자동으로 생성: `your-project.vercel.app`

### 커스텀 도메인 (선택)
1. **Settings** > **Domains**
2. 도메인 입력 후 DNS 설정

## 5. 배포 후 확인사항

### ✅ 체크리스트

- [ ] 홈페이지 로드 (`/`)
- [ ] API 동작 확인 (`/api/youtube/videos`)
- [ ] 이미지 업로드 테스트
- [ ] MongoDB 연결 확인
- [ ] Admin 로그인 테스트

### 🔍 문제 해결

**빌드 에러 발생 시:**
```bash
# 로컬에서 먼저 테스트
pnpm build
```

**환경 변수 오류:**
- Vercel Dashboard에서 환경 변수 재확인
- Redeploy 실행

**MongoDB 연결 실패:**
- MongoDB Atlas에서 Vercel IP 허용 (0.0.0.0/0)
- Network Access 설정 확인

## 6. 자동 배포 설정

**GitHub 연동 후 자동 배포:**
- `main` 브랜치 push → 프로덕션 배포
- PR 생성 → 미리보기 배포 자동 생성

## 7. 성능 최적화 (선택)

### Edge Functions
- API Routes는 자동으로 Edge에서 실행
- 전 세계 빠른 응답 속도

### Image Optimization
- Next.js Image 컴포넌트 사용 시 자동 최적화

### Caching
- YouTube API는 1시간 캐싱 설정됨
- ISR(Incremental Static Regeneration) 활용 가능

## 8. 비교: 기존 vs Vercel

| 항목 | 기존 (Render + GitHub Pages) | Vercel |
|------|----------------------------|--------|
| 배포 복잡도 | 프론트/백엔드 분리 배포 | 하나로 통합 |
| 빌드 시간 | 느림 | 빠름 (Turbopack) |
| Cold Start | 있음 (Render 무료 플랜) | 없음 |
| CORS 설정 | 필요 | 불필요 (동일 도메인) |
| 환경 변수 | 2곳 관리 | 1곳 관리 |
| 비용 | Render 무료 (제한적) | Vercel 무료 (넉넉함) |

## 9. 마이그레이션 체크리스트

- [x] Next.js 16 설정 완료
- [x] 모든 API Routes 마이그레이션
- [x] TypeScript 빌드 성공
- [x] 환경 변수 준비
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 첫 배포 테스트
- [ ] 도메인 연결 (선택)
- [ ] 기존 GitHub Pages 비활성화

## 10. 롤백 방법

문제 발생 시 이전 배포로 롤백:

1. Vercel Dashboard > **Deployments**
2. 이전 배포 선택
3. **Promote to Production** 클릭
