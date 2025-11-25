import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../components/LoadingContext";
import { uploadImage } from "../api/api";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return alert("제목과 이미지를 모두 입력해주세요.");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    setLoading(true);
    try {
      const data = await uploadImage(formData);
      console.log("업로드 완료:", data);
      navigate("/gallery");
    } catch (err) {
      console.error("업로드 중 오류 발생:", err);
      alert("업로드에 실패했습니다. 콘솔을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <UploadBox>
        <Title>📤 이미지 업로드</Title>
        <Form onSubmit={handleSubmit}>
          <label>제목</label>
          <input
            type="text"
            placeholder="이미지 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>이미지 선택</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && <PreviewImage src={previewUrl} alt="미리보기" />}
          <button type="submit">업로드</button>
        </Form>
        <Footer>© 2025 HANRORO FANSITE. All rights reserved.</Footer>
      </UploadBox>
    </PageWrapper>
  );
};

export default Upload;

const PageWrapper = styled.div`
  background: linear-gradient(to right, #6a4c93, #8b5fbf);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #6a4c93;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    font-weight: bold;
    color: #444;
  }

  input[type="text"] {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  input[type="file"] {
    font-size: 0.95rem;
  }

  button {
    padding: 0.7rem;
    background-color: #6a4c93;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Footer = styled.div`
  margin-top: 2rem;
  font-size: 0.85rem;
  text-align: center;
  color: #888;
`;
