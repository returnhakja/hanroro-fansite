/**
 * 클라이언트 → R2 직접 업로드 헬퍼 (presigned PUT)
 *
 * 1) /api/upload 로 presigned URL 요청
 * 2) 발급받은 URL 로 파일을 PUT (진행률은 XHR 로 보고)
 * 3) 공개 URL(publicUrl) 반환
 */

export interface UploadToR2Options {
  /** 'gallery' | 'board' */
  type?: 'gallery' | 'board';
  /** 진행률 콜백 (0~100) */
  onProgress?: (percentage: number) => void;
}

/** presigned URL 로 파일을 PUT. 진행률 보고를 위해 XHR 사용 */
function putWithProgress(
  uploadUrl: string,
  file: File,
  onProgress?: (percentage: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`업로드 실패 (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('네트워크 오류로 업로드에 실패했습니다'));
    xhr.send(file);
  });
}

/**
 * 파일을 R2 로 업로드하고 공개 URL 을 반환
 * @returns 업로드된 파일의 공개 URL
 */
export async function uploadToR2(
  file: File,
  { type = 'gallery', onProgress }: UploadToR2Options = {}
): Promise<string> {
  // 1) presigned URL 발급
  const res = await fetch(`/api/upload?type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || '업로드 URL 발급에 실패했습니다');
  }
  const { uploadUrl, publicUrl } = (await res.json()) as {
    uploadUrl: string;
    publicUrl: string;
  };

  // 2) R2 로 직접 PUT
  await putWithProgress(uploadUrl, file, onProgress);

  // 3) 공개 URL 반환
  return publicUrl;
}
