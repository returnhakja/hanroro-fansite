export interface FavoriteSetlist {
  _id: string;
  songs: string[];
  userId?: string | null;
  createdAt: string;
}
