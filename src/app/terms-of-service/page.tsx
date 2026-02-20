import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const metadata = {
  title: '서비스 이용약관 | 한로로 팬사이트',
  description: '한로로 팬사이트의 서비스 이용약관',
};

export default function TermsOfServicePage() {
  return (
    <Container>
      <Title>서비스 이용약관</Title>
      <LastUpdated>최종 수정일: 2025년 2월 20일</LastUpdated>

      <Section>
        <SectionTitle>제 1조 (목적)</SectionTitle>
        <Content>
          이 약관은 한로로 팬사이트(이하 "사이트")가 제공하는 모든 서비스(이하 "서비스")의 이용 조건 및 절차, 이용자와 사이트의 권리, 의무, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 2조 (용어의 정의)</SectionTitle>
        <Content>
          이 약관에서 사용하는 용어의 정의는 다음과 같습니다:
        </Content>
        <List>
          <ListItem><Strong>"서비스"</Strong>란 사이트가 제공하는 갤러리, 일정, 셋리스트, 게시판 등 모든 기능을 의미합니다.</ListItem>
          <ListItem><Strong>"회원"</Strong>이란 Google 계정으로 로그인하여 사이트와 서비스 이용 계약을 체결하고 사이트가 제공하는 서비스를 이용하는 자를 말합니다.</ListItem>
          <ListItem><Strong>"게시물"</Strong>이란 회원이 서비스를 이용함에 있어 게시한 글, 사진, 댓글 등을 의미합니다.</ListItem>
          <ListItem><Strong>"닉네임"</Strong>이란 회원의 식별과 서비스 이용을 위하여 회원이 설정한 문자와 숫자의 조합을 의미합니다.</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제 3조 (약관의 게시와 개정)</SectionTitle>
        <Content>
          1. 사이트는 이 약관의 내용을 회원이 쉽게 알 수 있도록 사이트 하단에 게시합니다.
        </Content>
        <Content>
          2. 사이트는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
        </Content>
        <Content>
          3. 사이트가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 사이트의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 4조 (서비스의 제공 및 변경)</SectionTitle>
        <Content>
          1. 사이트는 다음과 같은 서비스를 제공합니다:
        </Content>
        <List>
          <ListItem>갤러리: 팬이 업로드한 이미지 목록 및 모달 확대 보기</ListItem>
          <ListItem>일정: 다가오는 공연 D-day 카드 및 전체 캘린더</ListItem>
          <ListItem>셋리스트: 모든 공연의 셋리스트 (Day별 탭 지원)</ListItem>
          <ListItem>프로필: 아티스트 프로필 정보</ListItem>
          <ListItem>게시판: 팬 커뮤니티 게시판 (댓글/대댓글 지원)</ListItem>
          <ListItem>기타 사이트가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</ListItem>
        </List>
        <Content>
          2. 사이트는 상당한 이유가 있는 경우 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 5조 (서비스의 중단)</SectionTitle>
        <Content>
          1. 사이트는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
        </Content>
        <Content>
          2. 사이트는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여는 책임을 지지 않습니다. 단, 사이트에 고의 또는 과실이 있는 경우에는 그러하지 아니합니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 6조 (회원 가입)</SectionTitle>
        <Content>
          1. 회원가입은 Google 계정을 통한 로그인으로 이루어집니다.
        </Content>
        <Content>
          2. Google 로그인 시 제공되는 정보(이름, 이메일, 프로필 이미지)는 자동으로 등록되며, 회원은 닉네임을 별도로 설정할 수 있습니다.
        </Content>
        <Content>
          3. 회원은 이용 신청 시 제공한 정보에 변경이 있을 경우, 즉시 마이페이지에서 수정하여야 합니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 7조 (회원 탈퇴 및 자격 상실)</SectionTitle>
        <Content>
          1. 회원은 사이트에 언제든지 탈퇴를 요청할 수 있으며, 사이트는 즉시 회원 탈퇴를 처리합니다.
        </Content>
        <Content>
          2. 회원이 다음 각 호의 사유에 해당하는 경우, 사이트는 회원자격을 제한 및 정지시킬 수 있습니다:
        </Content>
        <List>
          <ListItem>가입 신청 시 허위 내용을 등록한 경우</ListItem>
          <ListItem>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</ListItem>
          <ListItem>사이트를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제 8조 (회원의 의무)</SectionTitle>
        <Content>
          1. 회원은 다음 행위를 하여서는 안 됩니다:
        </Content>
        <List>
          <ListItem>신청 또는 변경 시 허위 내용의 등록</ListItem>
          <ListItem>타인의 정보 도용</ListItem>
          <ListItem>사이트에 게시된 정보의 변경</ListItem>
          <ListItem>사이트가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</ListItem>
          <ListItem>사이트 기타 제3자의 저작권 등 지적재산권에 대한 침해</ListItem>
          <ListItem>사이트 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</ListItem>
          <ListItem>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 사이트에 공개 또는 게시하는 행위</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>제 9조 (게시물의 저작권)</SectionTitle>
        <Content>
          1. 회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.
        </Content>
        <Content>
          2. 회원이 서비스 내에 게시하는 게시물은 검색결과 내지 서비스 및 관련 프로모션 등에 노출될 수 있으며, 해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수 있습니다.
        </Content>
        <Content>
          3. 사이트는 제2항 이외의 방법으로 회원의 게시물을 이용하고자 하는 경우에는 전화, 이메일 등을 통해 사전에 회원의 동의를 얻어야 합니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 10조 (게시물의 관리)</SectionTitle>
        <Content>
          1. 회원의 게시물이 정보통신망법 및 저작권법 등 관련법에 위반되는 내용을 포함하는 경우, 권리자는 관련법이 정한 절차에 따라 해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 사이트는 관련법에 따라 조치를 취하여야 합니다.
        </Content>
        <Content>
          2. 사이트는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나 기타 사이트 정책 및 관련법에 위반되는 경우에는 관련법에 따라 해당 게시물에 대해 임시조치 등을 취할 수 있습니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 11조 (개인정보보호)</SectionTitle>
        <Content>
          1. 사이트는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
        </Content>
        <Content>
          2. 사이트는 회원가입 시 필요한 정보를 미리 수집하지 않습니다. Google 로그인 시 제공되는 정보만 수집합니다.
        </Content>
        <Content>
          3. 사이트는 개인정보의 수집·이용·제공에 관한 동의란을 미리 선택한 것으로 설정해두지 않습니다.
        </Content>
        <Content>
          4. 사이트는 개인정보의 수집목적 또는 제공받은 목적을 달성한 때에는 해당 개인정보를 지체 없이 파기합니다.
        </Content>
        <Content>
          5. 기타 개인정보보호에 관한 사항은 개인정보처리방침을 따릅니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 12조 (사이트의 의무)</SectionTitle>
        <Content>
          1. 사이트는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.
        </Content>
        <Content>
          2. 사이트는 이용자가 안전하게 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.
        </Content>
        <Content>
          3. 사이트는 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 13조 (책임의 한계)</SectionTitle>
        <Content>
          1. 사이트는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
        </Content>
        <Content>
          2. 사이트는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
        </Content>
        <Content>
          3. 사이트는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것이나 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
        </Content>
        <Content>
          4. 사이트는 회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 14조 (분쟁 해결)</SectionTitle>
        <Content>
          1. 사이트는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
        </Content>
        <Content>
          2. 사이트는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.
        </Content>
        <Content>
          3. 사이트와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>제 15조 (재판권 및 준거법)</SectionTitle>
        <Content>
          1. 사이트와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 대한민국 법을 준거법으로 합니다.
        </Content>
        <Content>
          2. 사이트와 이용자 간에 제기된 전자상거래 소송에는 대한민국의 법원을 관할 법원으로 합니다.
        </Content>
      </Section>

      <Section>
        <SectionTitle>부칙</SectionTitle>
        <Content>
          이 약관은 2025년 2월 20일부터 적용됩니다.
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
