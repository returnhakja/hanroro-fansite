import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return alert("제목과 이미지를 모두 입력해주세요.");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("업로드 완료:", data);
    navigate("/gallery");
  };

  return (
    <Container>
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">업로드</button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #6a4c93;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input[type="text"] {
    padding: 0.5rem;
    font-size: 1rem;
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
  }
`;

export default Upload;
