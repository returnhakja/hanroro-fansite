import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

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
