import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>© 2025 HANRORO FANSITE. All rights reserved.</p>
        <Links>
          <a
            href="https://www.instagram.com/hanr0r0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a href="/contact">Contact</a>
        </Links>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background-color: #f8f5f2;
  padding: 2rem;
  text-align: center;
  margin-top: 4rem;
  border-top: 1px solid #ddd;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FooterContent = styled.div`
  font-size: 0.9rem;
  color: #666;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Links = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  a {
    margin: 0 0.5rem;
    color: #6a4c93;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      font-size: 0.85rem;
    }
  }
`;
