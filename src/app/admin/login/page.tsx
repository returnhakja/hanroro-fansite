'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '로그인 실패');
        return;
      }

      // 토큰 저장
      localStorage.setItem('adminToken', data.token);

      // 대시보드로 이동
      router.push('/admin');
    } catch (err) {
      setError('서버 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>관리자 로그인</Title>
        <Subtitle>HANRORO Admin</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <Error>{error}</Error>}
          <Button type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>
        <HintText>
          초기 관리자 계정은 <code>pnpm seed:admin</code> 으로 생성하세요
        </HintText>
      </LoginBox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginBox = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #5568d3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.75rem;
  background: #fee;
  border-radius: 6px;
`;

const HintText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #95a5a6;
  text-align: center;

  code {
    background: #ecf0f1;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }
`;
