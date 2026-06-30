import { del } from '@vercel/blob';

/**
 * Vercel Blob에서 파일 삭제
 * @param url - 삭제할 파일의 URL
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Vercel Blob delete error:', error);
    throw new Error('Failed to delete file from Vercel Blob');
  }
}

/**
 * URL이 Vercel Blob URL인지 확인
 * @param url - 확인할 URL
 * @returns Vercel Blob URL이면 true
 */
export function isVercelBlobUrl(url: string): boolean {
  return url.includes('.public.blob.vercel-storage.com');
}

/**
 * URL이 Firebase Storage URL인지 확인
 * @param url - 확인할 URL
 * @returns Firebase Storage URL이면 true
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return url.includes('storage.googleapis.com');
}
