import mongoose, { Document, Schema, Model } from 'mongoose';

// 곡별 음악 맞추기 게임 재생 설정. songTitle은 getDiscographySongs()가 반환하는
// 제목과 그대로 매칭한다.
export interface IGameSong extends Document {
  songTitle: string;
  youtubeId: string;
  startSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

const gameSongSchema = new Schema<IGameSong>(
  {
    songTitle: { type: String, required: true, unique: true },
    youtubeId: { type: String, required: true },
    startSeconds: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const GameSong: Model<IGameSong> =
  mongoose.models.GameSong ||
  mongoose.model<IGameSong>('GameSong', gameSongSchema, 'gamesongs');

export default GameSong;
