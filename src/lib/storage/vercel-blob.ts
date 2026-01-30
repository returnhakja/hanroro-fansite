import { put, del } from '@vercel/blob';

/**
 * Vercel Blob에 파일 업로드
 * @param file - 업로드할 파일
 * @param folder - 저장할 폴더 (예: 'gallery')
 * @returns 업로드된 파일의 공개 URL
 */
export async function uploadToBlob(
  file: File,
  folder: string = 'gallery'
): Promise<string> {
  try {
    // 파일명 생성: folder/timestamp-filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${folder}/${timestamp}-${sanitizedFilename}`;

    // Vercel Blob에 업로드
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return blob.url;
  } catch (error) {
    console.error('Vercel Blob upload error:', error);
    throw new Error('Failed to upload file to Vercel Blob');
  }
}

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
