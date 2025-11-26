import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../api/api";

export const BoardWrite = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !author) {
      alert("제목, 내용, 작성자를 모두 입력해주세요.");
      return;
    }

    try {
      const data = await createBoard(title, content, author);
      console.log("작성 완료:", data);
      navigate("/board");
    } catch (err) {
      console.error("작성 실패:", err);
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem" }}>
      <h2>📝 게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>작성자</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          작성하기
        </button>
      </form>
    </div>
  );
};
