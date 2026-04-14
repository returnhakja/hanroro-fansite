// ─── 갤러리 ─────────────────────────────────────────────────────
export interface GalleryImage {
  _id: string;
  title: string;
  filename?: string;
  imageUrl: string;
  userId?: string | null;
  createdAt: string;
  type: 'image' | 'video';
}

export interface UploadMediaParams {
  file: File;
  title: string;
  onProgress?: (percentage: number) => void;
}
