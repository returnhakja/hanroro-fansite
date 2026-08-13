import type { Session } from 'next-auth';

interface Ownable {
  userId?: string | null;
}

export type OwnershipResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

// 작성자 본인 확인: 로그인 작성 글/댓글만 세션으로 인증.
// 익명 작성 글/댓글은 도용·비밀번호 대입 공격을 막기 위해 본인도 수정·삭제 불가.
export function verifyOwnership(
  item: Ownable,
  session: Session | null
): OwnershipResult {
  if (!item.userId) {
    return {
      ok: false,
      status: 403,
      error: '익명으로 작성한 글은 수정·삭제할 수 없습니다',
    };
  }

  if (!session?.user?.id || item.userId !== session.user.id) {
    return { ok: false, status: 403, error: '본인이 작성한 글만 처리할 수 있습니다' };
  }

  return { ok: true };
}
