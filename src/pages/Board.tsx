import DataTable, { TableColumn } from "react-data-table-component";
import { useEffect, useState } from "react";
import "../styles/boardTable.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Post {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
}

export const Board = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/board");
        setPosts(res.data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      } finally {
        setPending(false);
      }
    };
    fetchPosts();
  }, []);

  const columns: TableColumn<Post>[] = [
    { name: "제목", selector: (row) => row.title, sortable: true },
    { name: "작성자", selector: (row) => row.author, sortable: true },
    {
      name: "작성일",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "조회수",
      selector: (row) => row.views,
      sortable: true,
      right: true,
    },
    {
      name: "좋아요",
      selector: (row) => row.likes,
      sortable: true,
      right: true,
    },
  ];
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2>📋 커뮤니티 게시판</h2>
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button
          onClick={() => navigate("/board/write")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ✍️ 글쓰기
        </button>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        progressPending={pending}
        pagination
        highlightOnHover
        pointerOnHover
        defaultSortFieldId={1}
        onRowClicked={(row) => navigate(`/board/${row._id}`)}
      />
    </div>
  );
};
