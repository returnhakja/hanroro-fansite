'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useScrollLock } from '@/hooks/useScrollLock';

// 생일카페 모금 공지 (일회성 하드코딩 팝업)
// - 모금/카페 일정이 끝나면 더 이상 보여줄 필요가 없으므로 NOTICE_END 이후엔 자동으로 사라진다.
// - "오늘 하루 보지 않기"는 localStorage에 24시간짜리 타임스탬프로 저장한다.
const NOTICE_ID = 'birthday-cafe-2026-11';
const DISMISS_KEY = `hanroro_notice_dismiss_${NOTICE_ID}`;
const NOTICE_END = new Date('2026-11-23T00:00:00+09:00');
const CAFE_INFO_URL = 'https://naver.me/xG0BHJ1V';
const ACCOUNT_NUMBER = '93800201872161';

export default function BirthdayCafeNotice() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (new Date() > NOTICE_END) return;
    const dismissedUntil = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (Date.now() < dismissedUntil) return;
    setOpen(true);
  }, []);

  useScrollLock(open);

  const handleDismissToday = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
    setOpen(false);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 클립보드 접근 실패 시(권한 등) 조용히 무시 — 계좌번호는 화면에 그대로 보여서 직접 복사 가능
    }
  };

  if (!open) return null;

  return (
    <Overlay onClick={() => setOpen(false)}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseBtn aria-label="닫기" onClick={() => setOpen(false)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </CloseBtn>

        <Band>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2v4M8 4l1 2M16 4l-1 2" />
            <path d="M4 21v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
            <path d="M4 21h16" />
            <path d="M4 15c1-2 3-2 4 0s3 2 4 0 3-2 4 0 3 2 4 0" />
          </svg>
          <BandLabel>NOTICE · 생일카페 모금</BandLabel>
        </Band>

        <Body>
          <div>
            <Title>로로님 생일카페 모금 안내</Title>
            <Lede>로켓단의 마음을 모아 로로님의 특별한 하루를 함께 축하해요.</Lede>
          </div>

          <InfoBox>
            <InfoRow>
              <InfoLabel>카페 일정</InfoLabel>
              <InfoValue>11.21(토) ~ 11.22(일)</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>장소</InfoLabel>
              <InfoValue>위트윈스<br />(서울 마포구 망원동 57-179)</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>모금 기간</InfoLabel>
              <InfoValue>10.12(월) ~ 11.1(일)</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>목표 금액</InfoLabel>
              <InfoValueAccent>2,000,000원</InfoValueAccent>
            </InfoRow>
          </InfoBox>

          <CafeLink href={CAFE_INFO_URL} target="_blank" rel="noopener noreferrer">
            카페 위치·정보 자세히 보기 →
          </CafeLink>

          <AccountBox>
            <AccountLabel>모금 계좌</AccountLabel>
            <AccountRow>
              <AccountValue>KB국민은행 {ACCOUNT_NUMBER}</AccountValue>
              <CopyButton type="button" onClick={handleCopyAccount}>
                {copied ? '복사됨' : '복사'}
              </CopyButton>
            </AccountRow>
            <AccountNote>예금주 김X환 · 입금자명은 본명으로 부탁드려요</AccountNote>
            <AccountNote>모금 시작 시점 0원 · 모든 입금 내역 투명하게 공개</AccountNote>
          </AccountBox>

          <NoteText>
            🎁 11,111원 모금과 50,000원 이상 모금 시 특전을 드려요(50,000원 모금 시 두 특전 모두 수령, 11,111원 특전은 현장수령만 가능 · 111명 한정).
            모금 중간 현황은 주기적으로 공유하고, 생일카페 종료 후 사용 내역과 영수증도 투명하게 공개할게요.
            모금·생일카페 관련 문의는{' '}
            <NoteLink href="https://open.kakao.com/o/srMAlNri" target="_blank" rel="noopener noreferrer">
              오픈카톡
            </NoteLink>
            으로 부탁드려요.
          </NoteText>

          <Actions>
            <DismissLink type="button" onClick={handleDismissToday}>
              오늘 하루 보지 않기
            </DismissLink>
          </Actions>
        </Body>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(28, 22, 14, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  max-height: 88vh;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${theme.colors.surfaceAlt};
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;

  &:hover { color: ${theme.colors.textPrimary}; }
`;

const Band = styled.div`
  flex: none;
  height: 60px;
  background: linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 10px;
`;

const BandLabel = styled.span`
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
`;

const Body = styled.div`
  padding: 22px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  line-height: 1.4;
`;

const Lede = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.55;
`;

const InfoBox = styled.div`
  background: ${theme.colors.surfaceAlt};
  border-radius: ${theme.borderRadius.lg};
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.82rem;
`;

const InfoLabel = styled.span`
  flex: none;
  width: 72px;
  color: ${theme.colors.textTertiary};
  font-weight: 700;
`;

const InfoValue = styled.span`
  color: ${theme.colors.textPrimary};
  font-weight: 600;
  text-align: right;
`;

const InfoValueAccent = styled(InfoValue)`
  color: ${theme.colors.primary};
  font-weight: 800;
`;

const CafeLink = styled.a`
  align-self: flex-start;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  text-decoration: none;

  &:hover { text-decoration: underline; }
`;

const AccountBox = styled.div`
  border: 1.5px dashed ${theme.colors.accent};
  border-radius: ${theme.borderRadius.lg};
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AccountLabel = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${theme.colors.accentDark};
  letter-spacing: 0.03em;
`;

const AccountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const AccountValue = styled.span`
  font-size: 0.88rem;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
`;

const CopyButton = styled.button`
  flex: none;
  padding: 6px 12px;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.primary};
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;

  &:hover { background: ${theme.colors.primaryDark}; }
`;

const AccountNote = styled.span`
  font-size: 0.72rem;
  color: ${theme.colors.textSecondary};
`;

const NoteText = styled.p`
  margin: 0;
  font-size: 0.74rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  padding: 10px 12px;
`;

const NoteLink = styled.a`
  color: ${theme.colors.primary};
  font-weight: 700;
  text-decoration: underline;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2px;
`;

const DismissLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 0.75rem;
  color: ${theme.colors.textTertiary};
  text-decoration: underline;
  cursor: pointer;
`;
