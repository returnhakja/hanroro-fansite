// ─── 게시판 ─────────────────────────────────────────────────────
export interface BoardPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  userId?: string;
  createdAt: string;
  views: number;
  likes: number;
  likedBy?: string[];
  imageUrls?: string[];
}

export interface Comment {
  _id: string;
  boardId: string;
  content: string;
  author: string;
  userId?: string;
  parentId: string | null;
  depth: number;
  createdAt: string;
  deleted: boolean;
}

// ─── 관리자 게시판 ───────────────────────────────────────────────
export interface AdminPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  views: number;
  likes: number;
  createdAt: string;
  imageUrls: string[];
}

export interface AdminBoardStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
}
