import { theme } from "@/styles/theme";

export const BOARD_CATEGORIES = [
  { value: "notice", label: "공지" },
  { value: "info", label: "정보공유" },
  { value: "chat", label: "잡담" },
  { value: "question", label: "질문" },
] as const;

export type BoardCategory = (typeof BOARD_CATEGORIES)[number]["value"];

export const BOARD_CATEGORY_VALUES = BOARD_CATEGORIES.map((c) => c.value);

export const DEFAULT_BOARD_CATEGORY: BoardCategory = "info";

// 공지는 관리자 페이지에서만 지정 가능 — 일반 글쓰기 폼에는 노출하지 않음
export const PUBLIC_BOARD_CATEGORIES = BOARD_CATEGORIES.filter(
  (c) => c.value !== "notice"
);

export function isBoardCategory(value: unknown): value is BoardCategory {
  return (
    typeof value === "string" &&
    (BOARD_CATEGORY_VALUES as string[]).includes(value)
  );
}

export function getBoardCategoryLabel(value: string): string {
  return BOARD_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

const BOARD_CATEGORY_COLORS: Record<BoardCategory, string> = {
  notice: theme.colors.accentDark,
  info: theme.colors.info,
  chat: theme.colors.success,
  question: theme.colors.primary,
};

export function getBoardCategoryColor(value: string): string {
  return isBoardCategory(value)
    ? BOARD_CATEGORY_COLORS[value]
    : theme.colors.textTertiary;
}
