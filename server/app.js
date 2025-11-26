const express = require("express");
const mongoose = require("mongoose");
const uploadRouter = require("./routes/upload"); // 갤러리
const boardRouter = require("./routes/boardApi"); // 게시판
const path = require("path");
const cors = require("cors");

// 환경변수 로드 (Render에서는 웹에서 입력한 값 사용)
require("dotenv").config();

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const allowedOrigins = [
  "http://localhost:3000", // 로컬 개발용
  "https://returnhakja.github.io", // 깃허브 페이지 배포용
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.use("/api", uploadRouter);
app.use("/api/board", boardRouter);

// MongoDB 연결
console.log("MONGODB_URI:", process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

module.exports = app;
