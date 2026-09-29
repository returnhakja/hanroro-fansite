import jwt from 'jsonwebtoken';
import type { GameDifficulty } from './difficulty';

const JWT_SECRET = process.env.JWT_SECRET!;
const ROUND_EXPIRES_IN = '15m';

export interface GameRoundPayload {
  purpose: 'game-round';
  difficulty: GameDifficulty;
  songs: string[];
}

export function signRoundToken(difficulty: GameDifficulty, songs: string[]): string {
  const payload: GameRoundPayload = { purpose: 'game-round', difficulty, songs };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ROUND_EXPIRES_IN });
}

export function verifyRoundToken(token: string): GameRoundPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as GameRoundPayload;
    if (decoded.purpose !== 'game-round') return null;
    return decoded;
  } catch {
    return null;
  }
}
