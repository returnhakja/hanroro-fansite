import styled from "styled-components";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <HeaderContainer>
      <Logo to={"/"}>HANRORO</Logo>
      <Nav>
        <NavItem to="/gallery">Gallery</NavItem>
        <NavItem to="/board">Board</NavItem>
        <NavItem to="/support">Support</NavItem>
        <NavItem to="/archive">Archive</NavItem>
        <NavItem to="/profile">Profile</NavItem>
      </Nav>
      <Auth>
        <AuthButton to="/login">Login</AuthButton>
        <AuthButton to="/signup">Sign Up</AuthButton>
      </Auth>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem;
  background-color: #f8f5f2;
  border-bottom: 1px solid #ddd;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: #6a4c93;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;

  &:hover {
    color: #6a4c93;
  }
`;

const Auth = styled.div`
  display: flex;
  gap: 1rem;
`;

const AuthButton = styled(Link)`
  padding: 0.4rem 0.8rem;
  border: 1px solid #6a4c93;
  border-radius: 6px;
  text-decoration: none;
  color: #6a4c93;
  font-size: 0.9rem;

  &:hover {
    background-color: #6a4c93;
    color: white;
  }
`;

export default Header;
