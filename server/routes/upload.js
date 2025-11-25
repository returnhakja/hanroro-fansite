const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Image = require("../models/image");

const router = express.Router();

// uploads 폴더가 없으면 생성
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// multer 저장 설정 (한글 파일명 안전 처리 포함)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueName = Date.now() + "-" + safeBase + ext;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/**
 * 이미지 업로드 + DB 저장
 */
router.post("/upload", upload.single("image"), async (req, res) => {
  const { title } = req.body;
  const file = req.file;

  if (!file || !title) return res.status(400).send("제목과 파일이 필요함");

  try {
    const image = new Image({
      title,
      filename: file.filename,
    });
    await image.save();

    res.json({
      message: "업로드 성공",
      imageUrl: `http://localhost:5000/uploads/${file.filename}`,
      title,
      _id: image._id,
    });
  } catch (err) {
    console.error("DB 저장 오류:", err);
    res.status(500).send("서버 오류");
  }
});

/**
 *  이미지 목록 불러오기
 */
router.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    const imageUrls = images.map((img) => ({
      _id: img._id,
      title: img.title,
      createdAt: img.createdAt,
      imageUrl: `http://localhost:5000/uploads/${img.filename}`,
    }));
    console.log(images);
    console.log(imageUrls);
    res.json(imageUrls);
  } catch (err) {
    console.error("이미지 목록 오류:", err);
    res.status(500).send("이미지 목록을 불러올 수 없음");
  }
});

/**
 *  이미지 삭제
 */
router.delete("/image/:id", async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).send("이미지를 찾을 수 없음");

    const filePath = path.join(__dirname, "../uploads", image.filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("파일 삭제 실패:", err);
    });

    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("삭제 오류:", err);
    res.status(500).send("서버 오류");
  }
});

module.exports = router;
