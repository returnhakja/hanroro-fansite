import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Cloudflare R2 스토리지 유틸 (S3 호환)
 *
 * 환경변수:
 * - R2_ACCOUNT_ID       : Cloudflare 계정 ID
 * - R2_ACCESS_KEY_ID    : R2 API 토큰 Access Key
 * - R2_SECRET_ACCESS_KEY: R2 API 토큰 Secret Key
 * - R2_BUCKET           : 버킷 이름
 * - R2_PUBLIC_URL       : 공개 접근용 커스텀 도메인 (예: https://images.example.com)
 */

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

export const R2_BUCKET = process.env.R2_BUCKET ?? '';
/** 끝 슬래시 제거한 공개 URL 베이스 */
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '');

let cachedClient: S3Client | null = null;

/** R2용 S3 클라이언트 (지연 초기화) */
export function getR2Client(): S3Client {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 환경변수가 설정되지 않았습니다');
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return cachedClient;
}

/** 객체 key로부터 공개 URL 생성 */
export function getPublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * 클라이언트 직접 업로드용 presigned PUT URL 발급
 * @param key         버킷 내 객체 경로 (예: gallery/12345-photo.jpg)
 * @param contentType MIME 타입
 * @param expiresIn   만료(초), 기본 10분
 * @returns { uploadUrl, publicUrl }
 */
export async function createPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 600
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn });
  return { uploadUrl, publicUrl: getPublicUrl(key) };
}

/**
 * 서버에서 버퍼를 R2에 업로드 (마이그레이션/서버 업로드용)
 * @returns 공개 URL
 */
export async function uploadBufferToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return getPublicUrl(key);
}

/**
 * 다운로드용 presigned GET URL 발급 (Content-Disposition: attachment)
 * 브라우저가 이 URL로 R2에 직접 접속해 파일을 받으므로 Vercel/서버 트래픽을
 * 거치지 않는다(R2 egress 무료). CORS도 무관(top-level 이동).
 * @param key             버킷 내 객체 경로
 * @param downloadName    저장될 파일명 (attachment filename)
 * @param expiresIn       만료(초), 기본 5분
 */
export async function createPresignedDownloadUrl(
  key: string,
  downloadName: string,
  expiresIn = 300
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(
      downloadName
    )}`,
  });
  return getSignedUrl(getR2Client(), command, { expiresIn });
}

/** URL이 R2 공개 URL인지 확인 */
export function isR2Url(url: string): boolean {
  return R2_PUBLIC_URL !== '' && url.startsWith(R2_PUBLIC_URL);
}

/** R2 공개 URL에서 객체 key 추출 (아니면 null) */
export function keyFromR2Url(url: string): string | null {
  if (!isR2Url(url)) return null;
  return url.slice(R2_PUBLIC_URL.length + 1); // +1 은 슬래시
}

/** R2에서 객체 삭제 */
export async function deleteFromR2(url: string): Promise<void> {
  const key = keyFromR2Url(url);
  if (!key) return;
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key })
  );
}
