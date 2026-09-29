// 음악 맞추기 게임: 관대한 정답 매칭
// 공백/문장부호를 지우고 소문자로 맞춘 뒤, 편집거리 1까지는 오타로 보고 정답 처리한다.
// 너무 짧은 제목(3자 이하)은 오타 허용 시 다른 단어와 헷갈릴 수 있어 완전 일치만 인정한다.

function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s.,!?()~'"\-_]/g, '');
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export function isLenientMatch(guess: string, answer: string): boolean {
  const g = normalize(guess);
  const a = normalize(answer);
  if (!g) return false;
  if (g === a) return true;
  if (a.length <= 3) return false;
  return levenshtein(g, a) <= 1;
}
