"use client";

import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  INQUIRY_CATEGORY_LABELS,
  type InquiryCategory,
} from "@/lib/constants/inquiry";

type InquiryRow = {
  _id: string;
  userId: string;
  author: string;
  category: InquiryCategory;
  title: string;
  content: string;
  readByAdmin: boolean;
  replyCount: number;
  createdAt: string;
};

type AdminReply = {
  _id: string;
  content: string;
  adminEmail: string;
  createdAt: string;
};

type ModalDetail = {
  inquiry: InquiryRow;
  replies: AdminReply[];
};

function formatDate(iso: string) {
  return iso.slice(0, 10);
}

export default function AdminInquiriesPage() {
  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InquiryRow | null>(null);
  const [modalDetail, setModalDetail] = useState<ModalDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "목록을 불러올 수 없습니다");
      setRows(data.inquiries || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const loadModalDetail = useCallback(async (id: string) => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "불러오기 실패");
      setModalDetail({
        inquiry: { ...data.inquiry, content: data.inquiry.content },
        replies: data.replies || [],
      });
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "상세를 불러올 수 없습니다");
      setModalDetail(null);
    } finally {
      setModalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selected) {
      setModalDetail(null);
      setReplyText("");
      return;
    }
    loadModalDetail(selected._id);
  }, [selected, loadModalDetail]);

  const markRead = async (id: string, readByAdmin: boolean) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ readByAdmin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "수정 실패");
      setRows((prev) =>
        prev.map((r) => (r._id === id ? { ...r, readByAdmin } : r))
      );
      setSelected((s) =>
        s && s._id === id ? { ...s, readByAdmin } : s
      );
      if (modalDetail?.inquiry._id === id) {
        setModalDetail((d) =>
          d ? { ...d, inquiry: { ...d.inquiry, readByAdmin } } : d
        );
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류");
    }
  };

  const sendReply = async () => {
    if (!selected) return;
    const text = replyText.trim();
    if (!text) {
      alert("답변 내용을 입력해 주세요.");
      return;
    }
    setReplySending(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/inquiries/${selected._id}/replies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "등록 실패");
      setReplyText("");
      setRows((prev) =>
        prev.map((r) =>
          r._id === selected._id
            ? {
                ...r,
                replyCount: r.replyCount + 1,
                readByAdmin: true,
              }
            : r
        )
      );
      setSelected((s) =>
        s && s._id === selected._id
          ? { ...s, replyCount: s.replyCount + 1, readByAdmin: true }
          : s
      );
      await loadModalDetail(selected._id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류");
    } finally {
      setReplySending(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>비밀 문의</Title>
        <Subtitle>
          일반 게시판과 별도로 저장된 문의입니다. 내용은 로그인 사용자·운영자만
          열람할 수 있습니다.
        </Subtitle>
      </Header>

      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

      {loading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : rows.length === 0 ? (
        <EmptyText>접수된 문의가 없습니다</EmptyText>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th style={{ width: "12%" }}>상태</Th>
              <Th style={{ width: "12%" }}>유형</Th>
              <Th style={{ width: "24%" }}>제목</Th>
              <Th style={{ width: "8%" }}>답변</Th>
              <Th style={{ width: "12%" }}>작성자</Th>
              <Th style={{ width: "12%" }}>일자</Th>
              <Th style={{ width: "24%" }}>관리</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id}>
                <Td>
                  {row.readByAdmin ? (
                    <StatusOk>확인</StatusOk>
                  ) : (
                    <StatusNew>신규</StatusNew>
                  )}
                </Td>
                <Td>{INQUIRY_CATEGORY_LABELS[row.category]}</Td>
                <Td>
                  <TitleCell>{row.title}</TitleCell>
                </Td>
                <Td>
                  {row.replyCount > 0 ? (
                    <ReplyCountBadge>{row.replyCount}</ReplyCountBadge>
                  ) : (
                    <span style={{ color: "#bdc3c7" }}>—</span>
                  )}
                </Td>
                <Td>{row.author}</Td>
                <Td>{formatDate(row.createdAt)}</Td>
                <Td>
                  <ActionGroup>
                    <MiniButton type="button" onClick={() => setSelected(row)}>
                      내용 보기
                    </MiniButton>
                    {!row.readByAdmin ? (
                      <MiniButton
                        type="button"
                        $primary
                        onClick={() => markRead(row._id, true)}
                      >
                        확인 처리
                      </MiniButton>
                    ) : (
                      <MiniButton
                        type="button"
                        onClick={() => markRead(row._id, false)}
                      >
                        미확인으로
                      </MiniButton>
                    )}
                  </ActionGroup>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selected && (
        <ModalOverlay
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          onClick={() => setSelected(null)}
        >
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle id="inquiry-modal-title">{selected.title}</ModalTitle>
              <CloseButton
                type="button"
                aria-label="닫기"
                onClick={() => setSelected(null)}
              >
                ×
              </CloseButton>
            </ModalHeader>
            <ModalMeta>
              {INQUIRY_CATEGORY_LABELS[selected.category]} · {selected.author} ·{" "}
              {formatDate(selected.createdAt)} · userId: {selected.userId}
            </ModalMeta>
            <ModalBody>
              {modalLoading ? (
                <ModalLoadingText>불러오는 중…</ModalLoadingText>
              ) : !modalDetail ? (
                <ModalLoadingText>
                  상세를 불러오지 못했습니다. 닫은 뒤 다시 시도해 주세요.
                </ModalLoadingText>
              ) : (
                <>
                  <ModalSectionTitle>문의 내용</ModalSectionTitle>
                  {modalDetail.inquiry.content.split("\n").map((line, i) => (
                    <p key={`q-${i}`}>{line || "\u00a0"}</p>
                  ))}

                  <ModalSectionTitle style={{ marginTop: "1.5rem" }}>
                    운영자 답변
                  </ModalSectionTitle>
                  {modalDetail.replies.length === 0 ? (
                    <ReplyEmpty>등록된 답변이 없습니다.</ReplyEmpty>
                  ) : (
                    modalDetail.replies.map((r) => (
                      <ReplyCard key={r._id}>
                        <ReplyCardMeta>
                          {formatDate(r.createdAt)} · {r.adminEmail}
                        </ReplyCardMeta>
                        {r.content.split("\n").map((line, j) => (
                          <p key={j}>{line || "\u00a0"}</p>
                        ))}
                      </ReplyCard>
                    ))
                  )}

                  <ModalSectionTitle style={{ marginTop: "1.5rem" }}>
                    답변 작성
                  </ModalSectionTitle>
                  <ReplyTextarea
                    rows={4}
                    placeholder="사용자에게 보이는 답변입니다. (최대 3,000자)"
                    value={replyText}
                    maxLength={3000}
                    onChange={(e) => setReplyText(e.target.value)}
                    aria-label="운영자 답변 입력"
                  />
                  <ReplyCharCount>{replyText.length} / 3000</ReplyCharCount>
                  <ReplySubmitRow>
                    <FooterButton
                      type="button"
                      $primary
                      disabled={replySending}
                      onClick={sendReply}
                    >
                      {replySending ? "등록 중…" : "답변 등록"}
                    </FooterButton>
                  </ReplySubmitRow>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {modalDetail && !modalDetail.inquiry.readByAdmin && (
                <FooterButton
                  type="button"
                  $primary
                  onClick={() => {
                    markRead(selected._id, true);
                  }}
                >
                  확인만 처리 (답변 없이)
                </FooterButton>
              )}
              <FooterButton type="button" onClick={() => setSelected(null)}>
                닫기
              </FooterButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
`;

const ErrorBanner = styled.div`
  padding: 1rem;
  background: #fdecea;
  color: #c0392b;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #7f8c8d;
`;

const EmptyText = styled.p`
  color: #7f8c8d;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #34495e;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
`;

const Td = styled.td`
  padding: 0.875rem 1rem;
  border-top: 1px solid #ecf0f1;
  vertical-align: middle;
  font-size: 0.9rem;
  color: #2c3e50;
`;

const TitleCell = styled.div`
  font-weight: 500;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusNew = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: #ebf5fb;
  color: #2980b9;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const StatusOk = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: #e8f8f0;
  color: #27ae60;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MiniButton = styled.button<{ $primary?: boolean }>`
  padding: 0.35rem 0.65rem;
  font-size: 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${(p) => (p.$primary ? "#27ae60" : "#bdc3c7")};
  color: ${(p) => (p.$primary ? "white" : "#2c3e50")};
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 640px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.25rem 0.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  color: #7f8c8d;
  padding: 0 0.25rem;

  &:hover {
    color: #2c3e50;
  }
`;

const ModalMeta = styled.p`
  margin: 0;
  padding: 0 1.25rem 1rem;
  font-size: 0.8rem;
  color: #95a5a6;
  word-break: break-all;
`;

const ModalBody = styled.div`
  padding: 0 1.25rem 1.25rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #34495e;
  border-top: 1px solid #ecf0f1;
  border-bottom: 1px solid #ecf0f1;

  p {
    margin: 0 0 0.5rem 0;
  }
`;

const ModalLoadingText = styled.p`
  color: #7f8c8d;
  margin: 1rem 0;
`;

const ModalSectionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ReplyEmpty = styled.p`
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
`;

const ReplyCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;

  p:last-child {
    margin-bottom: 0;
  }
`;

const ReplyCardMeta = styled.div`
  font-size: 0.75rem;
  color: #95a5a6;
  margin-bottom: 0.35rem;
`;

const ReplyTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.85rem;
  border: 1px solid #dce0e4;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: 2px solid #3498db;
    outline-offset: 1px;
  }
`;

const ReplyCharCount = styled.div`
  font-size: 0.75rem;
  color: #95a5a6;
  text-align: right;
  margin: 0.25rem 0 0.5rem;
`;

const ReplySubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ReplyCountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  padding: 0.15rem 0.4rem;
  background: #ebf5fb;
  color: #2980b9;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const FooterButton = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: ${(p) => (p.$primary ? "#27ae60" : "#ecf0f1")};
  color: ${(p) => (p.$primary ? "white" : "#2c3e50")};

  &:hover {
    opacity: 0.92;
  }
`;
