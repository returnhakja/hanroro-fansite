import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import { Gallery } from "./pages/Gallery";
import Upload from "./pages/Upload";
import Footer from "./components/Footer";
import styled from "styled-components";

function App() {
  return (
    <PageWrapper>
      <BrowserRouter>
        <Header />
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/upload" element={<Upload />} />
            {/* 다른 페이지들 추가 예정 */}
          </Routes>
        </Content>
        <Footer />
      </BrowserRouter>
    </PageWrapper>
  );
}
export default App;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
`;
