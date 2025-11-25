import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingProvider } from "../components/LoadingContext";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  imageUrls?: string[];
}

export const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`http://localhost:5000/api/board/${id}`);
      setPost(res.data);
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    const res = await axios.post(`http://localhost:5000/api/board/${id}/like`);
    setPost((prev) => (prev ? { ...prev, likes: res.data.likes } : prev));
  };

  if (!post) return <LoadingProvider children={!post} />;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>{post.title}</h2>
      <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1rem" }}>
        작성자: {post.author} | 작성일:{" "}
        {new Date(post.createdAt).toLocaleDateString()} | 조회수: {post.views} |
        좋아요: {post.likes}
      </p>

      <hr />

      <div style={{ margin: "1rem 0", lineHeight: "1.6" }}>
        <p>{post.content}</p>
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            {post.imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="게시글 이미지"
                style={{
                  maxWidth: "100%",
                  marginTop: "0.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/board")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← 목록으로
        </button>

        <button
          onClick={handleLike}
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#E91E63",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ❤️ 좋아요 ({post.likes})
        </button>
      </div>
    </div>
  );
};
