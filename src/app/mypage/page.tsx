'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

export default function MyPage() {
  const { data: session, status, update } = useSession();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setNickname(data.nickname || '');
        }
      } catch (err) {
        console.error('프로필 로드 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '저장에 실패했습니다');
        return;
      }

      setMessage(data.message);
      // 세션 갱신하여 Header 등에 즉시 반영
      await update();
    } catch {
      setError('저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const res = await fetch('/api/user/profile', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || '회원탈퇴에 실패했습니다');
        setShowWithdrawModal(false);
        return;
      }
      await signOut({ callbackUrl: '/' });
    } catch {
      setError('회원탈퇴에 실패했습니다');
      setShowWithdrawModal(false);
    } finally {
      setWithdrawing(false);
    }
  };

  if (status === 'loading' || loading) {
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
            프로필을 확인하려면 로그인이 필요합니다.
          </LoginMessage>
          <LoginButton onClick={() => signIn('google')}>
            Google 로그인
          </LoginButton>
        </LoginSection>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>마이페이지</PageTitle>

      <ProfileCard>
        <ProfileHeader>
          {session.user?.image && (
            <ProfileImage src={session.user.image} alt="프로필" />
          )}
          <ProfileInfo>
            <DisplayName>
              {session.user?.nickname || session.user?.name}
            </DisplayName>
            <Email>{session.user?.email}</Email>
          </ProfileInfo>
        </ProfileHeader>

        <Divider />

        <Form onSubmit={handleSave}>
          <FormGroup>
            <Label>Google 이름</Label>
            <ReadOnlyInput value={session.user?.name || ''} readOnly />
          </FormGroup>

          <FormGroup>
            <Label>이메일</Label>
            <ReadOnlyInput value={session.user?.email || ''} readOnly />
          </FormGroup>

          <FormGroup>
            <Label>닉네임</Label>
            <NicknameInput
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setMessage('');
                setError('');
              }}
              placeholder="닉네임을 입력하세요 (2~20자)"
              maxLength={20}
              disabled={saving}
            />
            <HelpText>
              한글, 영문, 숫자, 언더스코어(_)만 사용 가능 · 비워두면 Google 이름이 사용됩니다
            </HelpText>
          </FormGroup>

          {message && <SuccessMessage>{message}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SaveButton type="submit" disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </SaveButton>
        </Form>

        <WithdrawSection>
          <WithdrawButton onClick={() => setShowWithdrawModal(true)}>
            회원탈퇴
          </WithdrawButton>
        </WithdrawSection>
      </ProfileCard>

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
                {withdrawing ? '처리 중...' : '탈퇴하기'}
              </ModalConfirmButton>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 2rem;
  min-height: 60vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 1.25rem;
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

const ProfileCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const ProfileImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${theme.colors.border};
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DisplayName = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const Email = styled.span`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textTertiary};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: 1.5rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  letter-spacing: 0.02em;
`;

const ReadOnlyInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textTertiary};
  background: ${theme.colors.surfaceAlt};
  cursor: not-allowed;
`;

const NicknameInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-family: ${theme.typography.fontBody};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.surface};
  transition: border-color ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }

  &:disabled {
    background: ${theme.colors.surfaceAlt};
    cursor: not-allowed;
  }
`;

const HelpText = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textTertiary};
`;

const SuccessMessage = styled.p`
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
`;

const ErrorMessage = styled.p`
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgba(244, 67, 54, 0.1);
  color: ${theme.colors.error};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
`;

const SaveButton = styled.button`
  padding: 0.875rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background ${theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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

const WithdrawSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: flex-end;
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
