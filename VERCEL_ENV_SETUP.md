# Vercel 환경 변수 설정 가이드

## 설정 방법

1. [Vercel Dashboard](https://vercel.com) 접속
2. 프로젝트 선택
3. **Settings** > **Environment Variables** 메뉴
4. 아래 변수들을 하나씩 추가

---

## 필수 환경 변수 목록

### 1. MongoDB (필수)

**Key:** `MONGODB_URI`
**Value:** `.env.local`에서 복사
**Environment:** Production, Preview, Development (모두 체크)

```
mongodb+srv://실제계정:실제비밀번호@실제클러스터.mongodb.net/데이터베이스명?retryWrites=true&w=majority
```

---

### 2. YouTube API (필수)

#### API Key
**Key:** `YOUTUBE_API_KEY`
**Value:** Google Cloud Console에서 발급받은 YouTube Data API v3 키
**Environment:** Production, Preview, Development

#### Channel ID
**Key:** `YOUTUBE_CHANNEL_ID`
**Value:** YouTube 채널 ID
**Environment:** Production, Preview, Development

> 💡 채널 ID 찾기: YouTube Studio > 설정 > 채널 > 고급 설정

---

### 3. Firebase (기존 이미지용 - 필수)

#### Service Account
**Key:** `FIREBASE_SERVICE_ACCOUNT`
**Value:** Firebase Console에서 다운로드한 서비스 계정 JSON (전체 내용)
**Environment:** Production, Preview, Development

```json
{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

> ⚠️ JSON을 **한 줄로** 붙여넣어야 합니다 (줄바꿈 제거)

#### Storage Bucket
**Key:** `FIREBASE_STORAGE_BUCKET`
**Value:** Firebase Storage 버킷 이름
**Environment:** Production, Preview, Development

```
your-project.firebasestorage.app
```

---

### 4. JWT Secret (필수)

**Key:** `JWT_SECRET`
**Value:** 랜덤한 긴 문자열 (최소 32자 권장)
**Environment:** Production, Preview, Development

> 💡 생성 방법:
> ```bash
> # Node.js에서 랜덤 문자열 생성
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

### 5. Admin Account (시드 스크립트용 - 필수)

#### Admin Email
**Key:** `ADMIN_EMAIL`
**Value:** 관리자 이메일
**Environment:** Production, Preview, Development

```
admin@yourdomain.com
```

#### Admin Password
**Key:** `ADMIN_PASSWORD`
**Value:** 관리자 비밀번호 (강력한 비밀번호 사용)
**Environment:** Production, Preview, Development

#### Admin Name
**Key:** `ADMIN_NAME`
**Value:** 관리자 이름
**Environment:** Production, Preview, Development

```
관리자
```

---

### 6. Vercel Blob (선택 - Vercel이 자동 생성)

**Key:** `BLOB_READ_WRITE_TOKEN`
**자동 생성:** Vercel Blob Storage를 활성화하면 자동으로 생성됨
**수동 추가 불필요**

> 📌 Vercel Dashboard > Storage > Connect Store > Blob 선택

---

## 빠른 체크리스트

복사할 때 체크하세요:

- [ ] `MONGODB_URI` - MongoDB Atlas 연결 문자열
- [ ] `YOUTUBE_API_KEY` - YouTube Data API 키
- [ ] `YOUTUBE_CHANNEL_ID` - YouTube 채널 ID
- [ ] `FIREBASE_SERVICE_ACCOUNT` - Firebase JSON (한 줄로)
- [ ] `FIREBASE_STORAGE_BUCKET` - Firebase Storage 버킷
- [ ] `JWT_SECRET` - 랜덤 문자열 (32자 이상)
- [ ] `ADMIN_EMAIL` - 관리자 이메일
- [ ] `ADMIN_PASSWORD` - 관리자 비밀번호
- [ ] `ADMIN_NAME` - 관리자 이름

---

## 주의사항

### ⚠️ 보안
1. **절대 Git에 올리지 마세요** - 실제 값은 `.env.local`에만 보관
2. **환경별 분리**: Production과 Development 환경 분리 권장
3. **정기적 변경**: JWT_SECRET, Admin 비밀번호는 정기적으로 변경

### 🔧 Environment 선택 가이드

| Environment | 설명 | 사용 시점 |
|-------------|------|-----------|
| **Production** | 실제 배포 환경 | `main` 브랜치 배포 시 |
| **Preview** | PR 미리보기 | Pull Request 생성 시 |
| **Development** | 개발 환경 | `vercel dev` 로컬 개발 시 |

> 💡 보통 모든 환경에 같은 값 사용 (개발/프로덕션 DB 분리 시 다르게 설정)

---

## 설정 후 확인

환경 변수 설정 후:

1. **Redeploy** 실행 (Deployments > ... > Redeploy)
2. 배포 완료 후 테스트:
   - `/api/youtube/videos` - YouTube API 동작 확인
   - `/admin/login` - Admin 로그인 테스트
   - 이미지 업로드 테스트

---

## 문제 해결

### MongoDB 연결 실패
- MongoDB Atlas에서 **Network Access** 확인
- IP 화이트리스트에 `0.0.0.0/0` 추가 (Vercel은 고정 IP 없음)

### JWT_SECRET 오류
- 길이가 충분한지 확인 (최소 32자)
- 특수문자 포함 가능

### Firebase 오류
- JSON 형식이 올바른지 확인
- **줄바꿈 제거** 필수 (한 줄로)

---

## .env.local에서 복사하는 방법

`.env.local` 파일을 열고 각 값을 복사:

```bash
# .env.local 파일 열기
code .env.local  # VS Code
notepad .env.local  # 메모장
```

각 변수의 `=` 뒤의 값만 복사해서 Vercel에 붙여넣으세요.
