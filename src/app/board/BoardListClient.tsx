"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Spinner from "@/components/ui/Spinner";
import { theme } from "@/styles/theme";
import { useBoardList, type BoardPost } from "@/hooks/queries/useBoard";
import {
  BOARD_CATEGORIES,
  getBoardCategoryColor,
  getBoardCategoryLabel,
} from "@/lib/board/categories";

interface BoardListClientProps {
  initialPosts: BoardPost[];
}

const CATEGORY_TABS = [{ value: "all", label: "전체" }, ...BOARD_CATEGORIES];

function formatDate(iso: string) {
  const date = new Date(iso);
  return `${String(date.getFullYear()).slice(2)}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function BoardListClient({
  initialPosts,
}: BoardListClientProps) {
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const { data: posts = [], isLoading } = useBoardList(initialPosts, {
    category,
    q: query,
  });

  const isFiltered = category !== "all" || query.length > 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput.trim());
  };

  const rows = useMemo(() => posts, [posts]);

  return (
    <Container>
      <PageHeader>
        <HeaderContent>
          <Overline>COMMUNITY</Overline>
          <Title>게시판</Title>
        </HeaderContent>
        <WriteButton onClick={() => router.push("/board/write")}>
          글쓰기
        </WriteButton>
      </PageHeader>

      <Toolbar>
        <CategoryTabs>
          {CATEGORY_TABS.map((tab) => (
            <CategoryTab
              key={tab.value}
              type="button"
              $active={category === tab.value}
              onClick={() => setCategory(tab.value)}
            >
              {tab.label}
            </CategoryTab>
          ))}
        </CategoryTabs>

        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="제목, 내용 검색"
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>
      </Toolbar>

      {isLoading && rows.length === 0 ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState>
          {isFiltered
            ? "검색 결과가 없습니다"
            : "아직 작성된 게시글이 없습니다"}
        </EmptyState>
      ) : (
        <Table>
          <HeadRow>
            <HeadCell>카테고리</HeadCell>
            <HeadCell>제목</HeadCell>
            <HeadCell $hideOnMobile>작성자</HeadCell>
            <HeadCell $hideOnMobile>날짜</HeadCell>
            <HeadCell $hideOnMobile $align="right">
              조회
            </HeadCell>
          </HeadRow>

          {rows.map((post) => (
            <Row key={post._id} onClick={() => router.push(`/board/${post._id}`)}>
              <Cell>
                <CategoryBadge $category={post.category}>
                  {getBoardCategoryLabel(post.category)}
                </CategoryBadge>
              </Cell>
              <Cell>
                <TitleText>{post.title}</TitleText>
                <MobileMeta>
                  {post.author} · {formatDate(post.createdAt)} · 조회{" "}
                  {post.views}
                </MobileMeta>
              </Cell>
              <Cell $hideOnMobile>{post.author}</Cell>
              <Cell $hideOnMobile>{formatDate(post.createdAt)}</Cell>
              <Cell $hideOnMobile $align="right">
                {post.views}
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: ${theme.colors.background};
  min-height: 60vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Overline = styled.span`
  font-size: ${theme.typography.overline.fontSize};
  font-weight: ${theme.typography.overline.fontWeight};
  letter-spacing: ${theme.typography.overline.letterSpacing};
  color: ${theme.colors.accent};
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  line-height: ${theme.typography.h1.lineHeight};
  letter-spacing: ${theme.typography.h1.letterSpacing};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const WriteButton = styled.button`
  padding: 0.625rem 1.75rem;
  background: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  white-space: nowrap;

  &:hover {
    background: ${theme.colors.accent};
    border-color: ${theme.colors.accent};
    color: ${theme.colors.textLight};
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  padding: 0.4rem 0.9rem;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid
    ${({ $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ $active }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ $active }) =>
    $active ? theme.colors.textLight : theme.colors.textSecondary};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.9rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  width: 200px;

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.colors.surfaceAlt};
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.surfaceWarm};
  }
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr 120px 90px 70px;
  border-top: 2px solid ${theme.colors.textPrimary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 76px 1fr;
  }
`;

const HeadRow = styled.div`
  display: contents;
`;

const Cell = styled.div<{ $hideOnMobile?: boolean; $align?: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ $align }) => ($align === "right" ? "flex-end" : "flex-start")};
  padding: 0.9rem 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  font-size: 0.875rem;
  color: ${theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? "none" : "flex")};
  }
`;

const HeadCell = styled(Cell)`
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  background: ${theme.colors.surfaceAlt};
  border-bottom: 2px solid ${theme.colors.textPrimary};
  white-space: nowrap;
`;

const Row = styled.div`
  display: contents;
  cursor: pointer;

  &:hover ${Cell} {
    background: ${theme.colors.surfaceAlt};
  }
`;

const TitleText = styled.span`
  font-family: ${theme.typography.fontBody};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MobileMeta = styled.span`
  display: none;
  font-size: 0.75rem;
  color: ${theme.colors.textTertiary};
  margin-top: 0.25rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: block;
  }
`;

const CategoryBadge = styled.span<{ $category: string }>`
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: 600;
  color: ${theme.colors.textLight};
  background: ${({ $category }) => getBoardCategoryColor($category)};
  white-space: nowrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  color: ${theme.colors.textTertiary};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
`;
