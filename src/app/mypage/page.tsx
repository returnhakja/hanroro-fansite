'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

export default function MyPage() {
  const { data: session, status, update } = useSession();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      </ProfileCard>
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
