const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// 이미지 목록 API
const fs = require("fs");

router.get("/images", (req, res) => {
  const dirpath = path.join(__dirname, "../uploads");
  fs.readdir(dirpath, (err, files) => {
    if (err) return res.status(500).send("이미지 목록을 불러 올 수 없음");
    const imageUrls = files.map((file) => `/uploads/${file}`);
    res.json(imageUrls);
  });
});

//서버 제목
router.post("/upload", upload.single("image"), (req, res) => {
  const { title } = req.body;
  const file = req.file;
  if (!file || !title) return res.status(400).send("제목과 파일이 필요함");
  console.log("업로드 제목 : ", title);

  res.join({
    title,
    imageUrl: `/uploads/${file.filename}`,
  });
});
module.exports = router;
