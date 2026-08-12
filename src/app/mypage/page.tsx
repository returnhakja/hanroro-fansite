"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useScrollLock } from "@/hooks/useScrollLock";
import {
  useAttendedConcerts,
  useUserStats,
  useToggleAttendedConcert,
  type AttendedConcert,
} from "@/hooks/queries/useAttendedConcerts";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}(${WEEKDAYS[d.getDay()]})`;
}

function calcDaysUntil(iso: string): number {
  const today = new Date();
  const target = new Date(iso);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const IconPencil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconChevron = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default function MyPage() {
  const { data: session, status, update } = useSession();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const { data: stats } = useUserStats();
  const { data: attended = [] } = useAttendedConcerts();
  const { uncheck } = useToggleAttendedConcert();

  useScrollLock(showWithdrawModal);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setNickname(data.nickname || "");
        }
      } catch (err) {
        console.error("프로필 로드 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const upcoming: AttendedConcert[] = [];
    const past: AttendedConcert[] = [];
    for (const item of attended) {
      if (new Date(item.date) >= now) upcoming.push(item);
      else past.push(item);
    }
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { upcoming, past };
  }, [attended]);

  const nextUpcoming = upcoming[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "저장에 실패했습니다");
        return;
      }

      setMessage(data.message);
      setEditingNickname(false);
      await update({ nickname: nickname.trim() });
    } catch {
      setError("저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "회원탈퇴에 실패했습니다");
        setShowWithdrawModal(false);
        return;
      }
      await signOut({ callbackUrl: "/" });
    } catch {
      setError("회원탈퇴에 실패했습니다");
      setShowWithdrawModal(false);
    } finally {
      setWithdrawing(false);
    }
  };

  const handleUncheck = (item: AttendedConcert) => {
    uncheck.mutate({ sourceType: item.sourceType, sourceId: item.sourceId });
  };

  if (status === "loading" || loading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container>
        <LoginSection>
          <LoginTitle>마이페이지</LoginTitle>
          <LoginMessage>
            프로필과 내가 체크한 공연을 확인하려면 로그인이 필요합니다.
          </LoginMessage>
          <LoginButton onClick={() => signIn("google")}>
            Google 로그인
          </LoginButton>
        </LoginSection>
      </Container>
    );
  }

  const displayName = session.user?.nickname || session.user?.name || "";
  const dday = nextUpcoming ? calcDaysUntil(nextUpcoming.date) : null;

  return (
    <Container>
      <PageTitle>마이페이지</PageTitle>

      <Profile>
        <Avatar>
          {session.user?.image ? (
            <AvatarImage src={session.user.image} alt="프로필" />
          ) : (
            displayName.charAt(0)
          )}
        </Avatar>
        <ProfileInfo>
          {editingNickname ? (
            <NicknameForm onSubmit={handleSave}>
              <NicknameInput
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setMessage("");
                  setError("");
                }}
                placeholder="닉네임 (2~20자)"
                maxLength={20}
                disabled={saving}
                autoFocus
              />
              <SmallButton type="submit" disabled={saving}>
                {saving ? "저장 중..." : "저장"}
              </SmallButton>
              <SmallGhostButton
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditingNickname(false);
                  setNickname(session.user?.nickname || "");
                  setError("");
                }}
              >
                취소
              </SmallGhostButton>
            </NicknameForm>
          ) : (
            <ProfileNameRow>
              <DisplayName>{displayName}</DisplayName>
              <IconButton
                type="button"
                onClick={() => setEditingNickname(true)}
                aria-label="닉네임 수정"
                title="닉네임 수정"
              >
                <IconPencil />
              </IconButton>
            </ProfileNameRow>
          )}
          <ProfileMeta>{session.user?.email}</ProfileMeta>
          {message && <SuccessMessage>{message}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ProfileInfo>
      </Profile>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats ? `${stats.attendedCount}회` : "–"}</StatValue>
          <StatLabel>다녀온 공연</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats ? `${stats.postCount}개` : "–"}</StatValue>
          <StatLabel>작성한 글</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats ? `${stats.commentCount}개` : "–"}</StatValue>
          <StatLabel>작성한 댓글</StatLabel>
        </StatCard>
      </StatsGrid>

      {nextUpcoming && dday !== null && (
        <DdayHero>
          <DdayNumber>
            <small>D-</small>
            {dday === 0 ? "DAY" : dday}
          </DdayNumber>
          <DdayBody>
            <DdayEyebrow>다음 공연까지</DdayEyebrow>
            <DdayTitle>{nextUpcoming.title}</DdayTitle>
            <DdayMeta>
              <IconCalendar />
              {[nextUpcoming.venue, formatShortDate(nextUpcoming.date)]
                .filter(Boolean)
                .join(" · ")}
            </DdayMeta>
          </DdayBody>
        </DdayHero>
      )}

      <Section>
        <SectionHead>
          <SectionHeadTitle>
            <IconCalendar />
            <h2>다가오는 공연</h2>
          </SectionHeadTitle>
          <SectionCount>{upcoming.length}개 체크됨</SectionCount>
        </SectionHead>

        {upcoming.length === 0 ? (
          <EmptyHint>
            아직 체크한 공연이 없어요.{" "}
            <Link href="/schedule">일정 페이지</Link>에서 다가오는 공연을 체크해보세요.
          </EmptyHint>
        ) : (
          <ConcertGrid>
            {upcoming.map((item) => {
              const d = calcDaysUntil(item.date);
              return (
                <ConcertCard key={item._id}>
                  <ConcertTop>
                    <Badge $tone="accent">{d === 0 ? "D-DAY" : `D-${d}`}</Badge>
                  </ConcertTop>
                  <ConcertTitle>{item.title}</ConcertTitle>
                  <ConcertMeta>
                    {[item.venue, formatShortDate(item.date)].filter(Boolean).join(" · ")}
                  </ConcertMeta>
                  <ConcertActions>
                    {item.sourceType === "event" && (
                      <ConcertLink href={`/schedule?event=${item.sourceId}`}>
                        일정 보기
                      </ConcertLink>
                    )}
                    <UncheckButton type="button" onClick={() => handleUncheck(item)}>
                      <IconClose />
                      체크 해제
                    </UncheckButton>
                  </ConcertActions>
                </ConcertCard>
              );
            })}
          </ConcertGrid>
        )}
      </Section>

      <Section>
        <SectionHead>
          <SectionHeadTitle>
            <IconCheck />
            <h2>다녀온 공연</h2>
          </SectionHeadTitle>
          <SectionCount>총 {past.length}회</SectionCount>
        </SectionHead>

        {past.length === 0 ? (
          <EmptyHint>
            다녀온 공연을 체크하면 여기에 기록이 쌓여요.
          </EmptyHint>
        ) : (
          <ConcertGrid>
            {past.map((item) => (
              <ConcertCard key={item._id} $muted>
                <ConcertTop>
                  <Badge $tone="success">다녀옴</Badge>
                </ConcertTop>
                <ConcertTitle>{item.title}</ConcertTitle>
                <ConcertMeta>
                  {[item.venue, formatShortDate(item.date)].filter(Boolean).join(" · ")}
                </ConcertMeta>
                <ConcertActions>
                  {item.sourceType === "concert" && (
                    <ConcertLink href={`/setlist?concertId=${item.sourceId}`}>
                      셋리스트 보기
                    </ConcertLink>
                  )}
                  <UncheckButton type="button" onClick={() => handleUncheck(item)}>
                    <IconClose />
                    체크 해제
                  </UncheckButton>
                </ConcertActions>
              </ConcertCard>
            ))}
          </ConcertGrid>
        )}
      </Section>

      <Settings>
        <summary>
          <IconChevron className="chev" />
          계정 설정
        </summary>
        <SettingsBody>
          <WithdrawButton type="button" onClick={() => setShowWithdrawModal(true)}>
            회원탈퇴
          </WithdrawButton>
        </SettingsBody>
      </Settings>

      {showWithdrawModal && (
        <ModalOverlay onClick={() => !withdrawing && setShowWithdrawModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>회원탈퇴</ModalTitle>
            <ModalMessage>
              정말로 탈퇴하시겠습니까?<br />
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </ModalMessage>
            <ModalButtons>
              <ModalCancelButton
                onClick={() => setShowWithdrawModal(false)}
                disabled={withdrawing}
              >
                취소
              </ModalCancelButton>
              <ModalConfirmButton onClick={handleWithdraw} disabled={withdrawing}>
                {withdrawing ? "처리 중..." : "탈퇴하기"}
              </ModalConfirmButton>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: 3rem 2rem 6rem;
  min-height: 60vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 1.25rem 4rem;
  }
`;

const PageTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  line-height: ${theme.typography.h2.lineHeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 2rem 0;
`;

/* ── 프로필 ─────────────────────────────────── */

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  margin-bottom: 1.75rem;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textLight};
  font-family: ${theme.typography.fontHeading};
  font-size: 1.4rem;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DisplayName = styled.span`
  font-size: 1.15rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${theme.colors.textTertiary};
  cursor: pointer;
  transition: background ${theme.transitions.fast}, color ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.surfaceWarm};
    color: ${theme.colors.textSecondary};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ProfileMeta = styled.div`
  margin-top: 0.2rem;
  font-size: 0.85rem;
  color: ${theme.colors.textTertiary};
`;

const NicknameForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const NicknameInput = styled.input`
  padding: 0.45rem 0.7rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.95rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  max-width: 220px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }

  &:disabled {
    background: ${theme.colors.surfaceAlt};
  }
`;

const SmallButton = styled.button`
  padding: 0.45rem 0.9rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SmallGhostButton = styled.button`
  padding: 0.45rem 0.9rem;
  background: transparent;
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.85rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${theme.colors.surfaceAlt};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #2e7d32;
`;

const ErrorMessage = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: ${theme.colors.error};
`;

/* ── 통계 ───────────────────────────────────── */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.surfaceAlt};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.md};
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const StatValue = styled.span`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.65rem;
  color: ${theme.colors.primaryDark};
  line-height: 1;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

/* ── D-day 히어로 ───────────────────────────── */

const DdayHero = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(
    135deg,
    ${theme.colors.primaryDark} 0%,
    ${theme.colors.primary} 62%,
    ${theme.colors.accent} 130%
  );
  color: #fbf5ea;
  padding: 1.75rem 2rem;
  margin-bottom: 2.5rem;
  box-shadow: ${theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: 1.75rem;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1.5rem;
  }
`;

const DdayNumber = styled.div`
  font-family: ${theme.typography.fontHeading};
  font-size: 3rem;
  line-height: 1;
  white-space: nowrap;

  small {
    font-size: 1rem;
    font-weight: 400;
    opacity: 0.85;
    margin-right: 0.1rem;
  }
`;

const DdayBody = styled.div`
  min-width: 0;
`;

const DdayEyebrow = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 0.35rem;
`;

const DdayTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const DdayMeta = styled.div`
  font-size: 0.85rem;
  opacity: 0.92;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  svg {
    width: 13px;
    height: 13px;
    opacity: 0.85;
    flex-shrink: 0;
  }
`;

/* ── 섹션 ───────────────────────────────────── */

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SectionHeadTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.accentDark};
  }

  h2 {
    font-family: ${theme.typography.fontHeading};
    font-size: 1.25rem;
    font-weight: 400;
    margin: 0;
    color: ${theme.colors.textPrimary};
  }
`;

const SectionCount = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textTertiary};
  white-space: nowrap;
`;

const EmptyHint = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.textTertiary};
  padding: 1.5rem;
  text-align: center;
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  margin: 0;

  a {
    color: ${theme.colors.primaryDark};
    font-weight: 500;
  }
`;

const ConcertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ConcertCard = styled.div<{ $muted?: boolean }>`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 1rem;
  opacity: ${({ $muted }) => ($muted ? 0.88 : 1)};
`;

const ConcertTop = styled.div`
  margin-bottom: 0.4rem;
`;

const Badge = styled.span<{ $tone: "accent" | "success" }>`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: ${theme.borderRadius.full};
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ $tone }) =>
    $tone === "accent" ? theme.colors.accent : "rgba(107, 142, 107, 0.15)"};
  color: ${({ $tone }) => ($tone === "accent" ? "#3a2e14" : theme.colors.success)};
`;

const ConcertTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: 0.3rem;
  overflow-wrap: break-word;
`;

const ConcertMeta = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: 0.65rem;
`;

const ConcertActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ConcertLink = styled(Link)`
  font-size: 0.78rem;
  color: ${theme.colors.primaryDark};
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const UncheckButton = styled.button`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.78rem;
  color: ${theme.colors.textTertiary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${theme.colors.textSecondary};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

/* ── 계정 설정 ───────────────────────────────── */

const Settings = styled.details`
  border-top: 1px solid ${theme.colors.border};
  padding-top: 1.25rem;

  summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: ${theme.colors.textSecondary};
    font-weight: 500;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  .chev {
    width: 13px;
    height: 13px;
    color: ${theme.colors.textTertiary};
    transition: transform 0.18s ease;
  }

  &[open] .chev {
    transform: rotate(90deg);
  }
`;

const SettingsBody = styled.div`
  padding: 1.25rem 0.1rem 0.25rem;
`;

const WithdrawButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: ${theme.colors.textTertiary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.error};
    border-color: ${theme.colors.error};
  }
`;

/* ── 로딩 / 로그인 ───────────────────────────── */

const LoadingText = styled.p`
  text-align: center;
  color: ${theme.colors.textTertiary};
  padding: 3rem 0;
`;

const LoginSection = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const LoginTitle = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 1rem 0;
`;

const LoginMessage = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0 0 2rem 0;
`;

const LoginButton = styled.button`
  padding: 0.75rem 2rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.full};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover {
    background: ${theme.colors.primaryDark};
  }
`;

/* ── 탈퇴 모달 ───────────────────────────────── */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const ModalTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.75rem 0;
`;

const ModalMessage = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const ModalCancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.95rem;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalConfirmButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: ${theme.colors.error};
  color: #fff;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity ${theme.transitions.fast};

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
