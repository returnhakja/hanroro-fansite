'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useAdminBoard, useAdminDeletePost } from '@/hooks/queries/useAdminBoard';

export default function BoardManagePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminBoard(page, searchQuery);
  const posts = data?.posts ?? [];
  const stats = data?.stats ?? { totalPosts: 0, totalViews: 0, totalLikes: 0 };
  const totalPages = data?.totalPages ?? 1;

  const deleteMutation = useAdminDeletePost();

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?\n(댓글도 함께 삭제됩니다)')) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
      alert('게시글이 삭제되었습니다');
    } catch {
      alert('게시글을 삭제할 수 없습니다');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // 검색 시 첫 페이지로
  };

  return (
    <Container>
      <Header>
        <Title>게시글 관리</Title>
        <Subtitle>팬 게시판 게시글을 관리합니다</Subtitle>
      </Header>

      {/* 통계 */}
      <StatsGrid>
        <StatCard>
          <StatIcon>📝</StatIcon>
          <StatNumber>{stats.totalPosts}</StatNumber>
          <StatLabel>총 게시글</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>👀</StatIcon>
          <StatNumber>{stats.totalViews.toLocaleString()}</StatNumber>
          <StatLabel>총 조회수</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>❤️</StatIcon>
          <StatNumber>{stats.totalLikes}</StatNumber>
          <StatLabel>총 좋아요</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* 검색 */}
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="제목, 내용, 작성자로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton type="submit">검색</SearchButton>
      </SearchForm>

      {/* 게시글 목록 */}
      {isLoading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : posts.length === 0 ? (
        <EmptyText>게시글이 없습니다</EmptyText>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: '50%' }}>제목</Th>
                <Th style={{ width: '15%' }}>작성자</Th>
                <Th style={{ width: '10%' }}>조회수</Th>
                <Th style={{ width: '10%' }}>좋아요</Th>
                <Th style={{ width: '15%' }}>작성일</Th>
                <Th style={{ width: '10%' }}>관리</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <Td>
                    <PostTitle
                      href={`/board/${post._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.title}
                      {post.imageUrls && post.imageUrls.length > 0 && (
                        <ImageBadge>🖼️ {post.imageUrls.length}</ImageBadge>
                      )}
                    </PostTitle>
                    <ContentPreview>
                      {post.content.substring(0, 50)}
                      {post.content.length > 50 && '...'}
                    </ContentPreview>
                  </Td>
                  <Td>{post.author}</Td>
                  <Td>{post.views}</Td>
                  <Td>{post.likes}</Td>
                  <Td>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</Td>
                  <Td>
                    <ActionButton onClick={() => handleDelete(post._id)}>
                      삭제
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* 페이지네이션 */}
          <Pagination>
            <PageButton onClick={() => setPage(1)} disabled={page === 1}>
              처음
            </PageButton>
            <PageButton
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              이전
            </PageButton>
            <PageInfo>
              {page} / {totalPages}
            </PageInfo>
            <PageButton
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              다음
            </PageButton>
            <PageButton
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              마지막
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 1400px;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #8b7355;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #7f8c8d;
  font-weight: 500;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #8b7355;
  }
`;

const SearchButton = styled.button`
  padding: 0.875rem 2rem;
  background: #8b7355;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6d5942;
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
`;

const PostTitle = styled(Link)`
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #8b7355;
    text-decoration: underline;
  }
`;

const ImageBadge = styled.span`
  font-size: 0.75rem;
  color: #8b7355;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const ContentPreview = styled.div`
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #c0392b;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #8b7355;
    color: white;
    border-color: #8b7355;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  padding: 0 1rem;
  color: #495057;
  font-weight: 600;
`;
