import axios from "axios";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://hanroro-fansite.onrender.com/api"
    : "http://localhost:5000/api";

/* Gallery */

export const fetchImages = async () => {
  const res = await axios.get(`${BASE_URL}/images`);
  return res.data;
};

export const uploadImage = async (formData: FormData) => {
  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteImage = async (id: string) => {
  const res = await axios.delete(`${BASE_URL}/image/${id}`);
  return res.status === 200;
};

/* Board */

export const fetchBoard = async () => {
  const res = await axios.get(`${BASE_URL}/board`);
  return res.data;
};

export const createBoard = async (
  title: string,
  content: string,
  author: string,
  imageUrls: string[] = []
) => {
  const res = await axios.post(`${BASE_URL}/board`, {
    title,
    content,
    author,
    imageUrls,
  });
  return res.data;
};

export type BoardPayload = {
  title: string;
  content: string;
  author: string;
  imageUrls?: string[];
};

export const updateBoard = async (id: string, payload: BoardPayload) => {
  const res = await axios.put(`${BASE_URL}/board/${id}`, payload);
  return res.data;
};

export const deleteBoardPost = async (id: string) => {
  const res = await axios.delete(`${BASE_URL}/board/${id}`);
  return res.status === 200;
};

export const uploadBoardImages = async (formData: FormData) => {
  const res = await axios.post(`${BASE_URL}/board/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as { imageUrls: string[] };
};

export const getBoardById = async (id: string | undefined) => {
  const res = await axios.get(`${BASE_URL}/board/${id}`);
  return res.data;
};

export const likeBoard = async (id: string | undefined) => {
  const res = await axios.post(`${BASE_URL}/board/${id}/like`);
  return res.data;
};

/* 기타 */

export const fetchRandomImage = async () => {
  const res = await axios.get(`${BASE_URL}/images/random`);
  return res.data;
};
