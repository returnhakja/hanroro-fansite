import type { Session } from 'next-auth';

interface Ownable {
  userId?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type OwnershipResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

// 작성자 본인 확인: 로그인 작성 글/댓글은 세션, 익명 작성 글/댓글은 비밀번호로 인증
export async function verifyOwnership(
  item: Ownable,
  session: Session | null,
  password: string | undefined
): Promise<OwnershipResult> {
  if (item.userId) {
    if (!session?.user?.id || item.userId !== session.user.id) {
      return { ok: false, status: 403, error: '본인이 작성한 글만 처리할 수 있습니다' };
    }
    return { ok: true };
  }

  if (!password) {
    return { ok: false, status: 400, error: '비밀번호를 입력해주세요' };
  }
  const matched = await item.comparePassword(password);
  if (!matched) {
    return { ok: false, status: 403, error: '비밀번호가 일치하지 않습니다' };
  }
  return { ok: true };
}
