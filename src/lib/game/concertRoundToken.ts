import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ROUND_EXPIRES_IN = '15m';

export interface ConcertRoundPayload {
  purpose: 'concert-game-round';
  questionIds: string[];
}

export function signConcertRoundToken(questionIds: string[]): string {
  const payload: ConcertRoundPayload = { purpose: 'concert-game-round', questionIds };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ROUND_EXPIRES_IN });
}

export function verifyConcertRoundToken(token: string): ConcertRoundPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ConcertRoundPayload;
    if (decoded.purpose !== 'concert-game-round') return null;
    return decoded;
  } catch {
    return null;
  }
}
