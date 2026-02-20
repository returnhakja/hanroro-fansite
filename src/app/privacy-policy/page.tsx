import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const metadata = {
  title: '개인정보처리방침 | 한로로 팬사이트',
  description: '한로로 팬사이트의 개인정보처리방침',
};

export default function PrivacyPolicyPage() {
  return (
    <Container>
      <Title>개인정보처리방침</Title>
      <LastUpdated>최종 수정일: 2025년 2월 20일</LastUpdated>

      <Section>
        <SectionTitle>1. 개인정보의 수집 및 이용 목적</SectionTitle>
        <Content>
          한로로 팬사이트(이하 "본 사이트")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </Content>
        <List>
          <ListItem>회원 가입 및 관리: Google 계정을 통한 회원 식별, 본인 확인</ListItem>
          <ListItem>게시판 서비스 제공: 게시글 및 댓글 작성자 식별, 닉네임 표시</ListItem>
          <ListItem>서비스 개선: 사용자 경험 향상을 위한 통계 분석</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>2. 수집하는 개인정보 항목</SectionTitle>
        <Content>
          본 사이트는 Google OAuth 2.0을 통해 다음의 개인정보를 수집합니다:
        </Content>
        <List>
          <ListItem><Strong>필수 항목:</Strong> Google 이름, 이메일 주소, 프로필 이미지, Google ID</ListItem>
          <ListItem><Strong>선택 항목:</Strong> 닉네임 (사용자가 직접 설정)</ListItem>
          <ListItem><Strong>자동 수집 항목:</Strong> 마지막 로그인 시간</ListItem>
        </List>
        <Content>
          위 정보는 Google 로그인 시 Google로부터 제공받으며, 본 사이트는 추가적인 개인정보를 직접 수집하지 않습니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>3. 개인정보의 보유 및 이용 기간</SectionTitle>
        <Content>
          본 사이트는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </Content>
        <List>
          <ListItem><Strong>회원 정보:</Strong> 회원 탈퇴 시까지</ListItem>
          <ListItem><Strong>게시글 및 댓글:</Strong> 회원 탈퇴 후에도 게시판 운영을 위해 보존될 수 있으며, 작성자 정보는 익명 처리됩니다</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>4. 개인정보의 제3자 제공</SectionTitle>
        <Content>
          본 사이트는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
        </Content>
        <Content>
          현재 본 사이트는 수집한 개인정보를 제3자에게 제공하지 않습니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>5. 개인정보 처리의 위탁</SectionTitle>
        <Content>
          본 사이트는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
        </Content>
        <List>
          <ListItem><Strong>Google (Google LLC):</Strong> 로그인 인증 처리</ListItem>
          <ListItem><Strong>MongoDB (MongoDB, Inc.):</Strong> 데이터베이스 호스팅 및 관리</ListItem>
          <ListItem><Strong>Vercel (Vercel Inc.):</Strong> 웹 호스팅 및 서버 운영</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>6. 정보주체의 권리·의무 및 행사 방법</SectionTitle>
        <Content>
          정보주체는 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
        </Content>
        <List>
          <ListItem>개인정보 열람 요구</ListItem>
          <ListItem>개인정보 정정·삭제 요구</ListItem>
          <ListItem>개인정보 처리정지 요구</ListItem>
        </List>
        <Content>
          위 권리 행사는 마이페이지에서 직접 수정하거나, 본 사이트 관리자에게 이메일로 요청하실 수 있습니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>7. 개인정보의 파기</SectionTitle>
        <Content>
          본 사이트는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
        </Content>
        <List>
          <ListItem><Strong>파기 절차:</Strong> 회원 탈퇴 요청 시 즉시 파기</ListItem>
          <ListItem><Strong>파기 방법:</Strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>8. 개인정보의 안전성 확보 조치</SectionTitle>
        <Content>
          본 사이트는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
        </Content>
        <List>
          <ListItem>개인정보 암호화: 비밀번호는 암호화되어 저장 및 관리</ListItem>
          <ListItem>해킹 등에 대비한 기술적 대책: 보안프로그램을 설치하고 주기적으로 갱신·점검</ListItem>
          <ListItem>접근 제한: 개인정보처리시스템에 대한 접근권한을 최소한의 인원으로 제한</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>9. 개인정보 보호책임자</SectionTitle>
        <Content>
          본 사이트는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </Content>
        <ContactBox>
          <ContactItem><Strong>개인정보 보호책임자:</Strong> 한로로 팬사이트 관리자</ContactItem>
          <ContactItem><Strong>이메일:</Strong> [관리자 이메일 주소]</ContactItem>
        </ContactBox>
      </Section>

      <Section>
        <SectionTitle>10. 개인정보처리방침의 변경</SectionTitle>
        <Content>
          이 개인정보처리방침은 2025년 2월 20일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>11. Google 로그인 관련 안내</SectionTitle>
        <Content>
          본 사이트는 Google OAuth 2.0을 사용하여 로그인 기능을 제공합니다. Google 로그인 시 Google의 개인정보처리방침이 적용되며, 본 사이트는 Google로부터 제공받은 최소한의 정보(이름, 이메일, 프로필 이미지)만을 수집합니다.
        </Content>
        <Content>
          Google의 개인정보처리방침은 <ExternalLink href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</ExternalLink>에서 확인하실 수 있습니다.
        </Content>
      </Section>
    </Container>
  );
}

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
  min-height: 70vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 1.25rem;
  }
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontHeading};
  font-size: ${theme.typography.h1.fontSize};
  font-weight: ${theme.typography.h1.fontWeight};
  color: ${theme.colors.textPrimary};
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

const LastUpdated = styled.p`
  text-align: center;
  color: ${theme.colors.textTertiary};
  font-size: ${theme.typography.small.fontSize};
  margin: 0 0 3rem 0;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontHeading};
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${theme.colors.border};
`;

const Content = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${theme.colors.textSecondary};
  margin: 0 0 1rem 0;
`;

const List = styled.ul`
  margin: 1rem 0;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  font-size: 1rem;
  line-height: 1.7;
  color: ${theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const Strong = styled.strong`
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const ContactBox = styled.div`
  background: ${theme.colors.surfaceAlt};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 1.5rem;
  margin: 1rem 0;
`;

const ContactItem = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${theme.colors.textSecondary};
  margin: 0.5rem 0;
`;

const ExternalLink = styled.a`
  color: ${theme.colors.primary};
  text-decoration: underline;

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`;
