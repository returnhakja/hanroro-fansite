import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingProvider } from "../components/LoadingContext";
import { deleteBoardPost, getBoardById, likeBoard } from "../api/api";
import { ConfirmModal } from "../components/ConfirmModal";
import { useToast } from "../components/ToastContext";

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
  const { showToast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBoardById(id);
        setPost(data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const data = await likeBoard(id);
      setPost((prev) => (prev ? { ...prev, likes: data.likes } : prev));
    } catch (err) {
      console.error("좋아요 실패:", err);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      const ok = await deleteBoardPost(id);
      if (ok) {
        showToast("게시글이 삭제되었습니다.", "success");
        navigate("/board");
        return;
      }
      showToast("삭제에 실패했어요.", "error");
    } catch (err) {
      console.error("삭제 실패:", err);
      showToast("삭제 중 오류가 발생했습니다.", "error");
    }
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

      <div style={{ marginTop: "2rem", display: "flex", gap: "0.5rem" }}>
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
          목록으로
        </button>

        <button
          onClick={() => id && navigate(`/board/${id}/edit`)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6a4c93",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          수정
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#e03131",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          삭제
        </button>

        <button
          onClick={handleLike}
          style={{
            marginLeft: "auto",
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

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="게시글 삭제"
        description="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          void handleDelete();
        }}
      />
    </div>
  );
};

