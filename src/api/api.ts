import axios from "axios";

// Next.js API Routes 사용 (Vercel 배포)
export const BASE_URL = "/api";

// 이미지 목록 불러오기
export const fetchImages = async () => {
  const res = await axios.get(`${BASE_URL}/images`);
  return res.data;
};

// 이미지 업로드
export const uploadImage = async (formData: FormData) => {
  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 이미지 삭제
export const deleteImage = async (id: string) => {
  const res = await axios.delete(`${BASE_URL}/image/${id}`);
  return res.status === 200;
};

/* Board */

// 게시글 불러오기
export const fetchBoard = async () => {
  const res = await axios.get(`${BASE_URL}/board`);
  return res.data;
};

// 게시글 작성
export const createBoard = async (
  title: string,
  content: string,
  author: string
) => {
  const res = await axios.post(`${BASE_URL}/board`, {
    title,
    content,
    author,
  });
  return res.data;
};

// 게시글 상세 조회
export const getBoardById = async (id: string | undefined) => {
  const res = await axios.get(`${BASE_URL}/board/${id}`);
  return res.data;
};

// 게시글 좋아요
export const likeBoard = async (id: string | undefined) => {
  const res = await axios.post(`${BASE_URL}/board/${id}/like`);
  return res.data;
};

export const fetchRandomImage = async () => {
  const res = await axios.get(`${BASE_URL}/images/random`);
  return res.data;
};
