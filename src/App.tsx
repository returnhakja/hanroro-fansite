import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import { Gallery } from "./pages/Gallery";
import Upload from "./pages/Upload";
import Footer from "./components/Footer";
import styled from "styled-components";
import { LoadingProvider } from "./components/LoadingContext";
import { ToastProvider } from "./components/ToastContext";
import { Board } from "./pages/Board";
import { BoardWrite } from "./pages/BoardWrite";
import { BoardDetail } from "./pages/BoardDetail";
import { BoardEdit } from "./pages/BoardEdit";
import { ArtistProfile } from "./pages/ArtistProfile";
import Modal from "react-modal";

Modal.setAppElement("#root");

function App() {
  return (
    <LoadingProvider>
      <ToastProvider>
        <PageWrapper>
          <HashRouter>
            <Header />
            <Content>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/upload" element={<Upload />} />
              <Route path="/board" element={<Board />} />
              <Route path="/board/write" element={<BoardWrite />} />
              <Route path="/board/:id" element={<BoardDetail />} />
              <Route path="/board/:id/edit" element={<BoardEdit />} />
              <Route path="/profile" element={<ArtistProfile />} />
            </Routes>
            </Content>
            <Footer />
          </HashRouter>
        </PageWrapper>
      </ToastProvider>
    </LoadingProvider>
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
