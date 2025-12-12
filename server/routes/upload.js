const express = require("express");
const multer = require("multer");
const { bucket } = require("../firebase");
const Image = require("../models/image");

const router = express.Router();

// multer 설정: 메모리 저장 후 Firebase 업로드
const upload = multer({ storage: multer.memoryStorage() });

const uploadToFirebase = async (file, folder) => {
  const ext = file.originalname.split(".").pop();
  const safeBase = file.originalname.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${folder}/${Date.now()}-${safeBase}.${ext}`;

  const fileRef = bucket.file(filename);
  await fileRef.save(file.buffer, {
    contentType: file.mimetype,
    metadata: { contentType: file.mimetype },
    resumable: false,
  });

  await fileRef.makePublic();
  const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  return { filename, imageUrl };
};

/**
 * 갤러리 이미지 업로드 + DB 저장
 */
router.post("/upload", upload.single("image"), async (req, res) => {
  const { title } = req.body;
  const file = req.file;

  if (!file || !title) {
    return res.status(400).send("제목과 파일이 필요합니다.");
  }

  try {
    const { filename, imageUrl } = await uploadToFirebase(file, "gallery");

    const image = new Image({
      title,
      filename,
      imageUrl,
    });
    await image.save();

    res.json({
      message: "업로드 성공",
      imageUrl,
      title,
      _id: image._id,
    });
  } catch (err) {
    console.error("업로드 오류:", err);
    res.status(500).send("서버 오류");
  }
});

/**
 * 게시판 이미지 업로드 (여러 장)
 * DB 저장 없이 URL 배열만 반환
 */
router.post("/board/upload", upload.array("images"), async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  if (!files.length) {
    return res.status(400).send("이미지 파일이 필요합니다.");
  }

  try {
    const uploaded = await Promise.all(
      files.map((file) => uploadToFirebase(file, "board"))
    );
    res.json({ imageUrls: uploaded.map((u) => u.imageUrl) });
  } catch (err) {
    console.error("게시판 이미지 업로드 오류:", err);
    res.status(500).send("서버 오류");
  }
});

/**
 * 갤러리 이미지 목록
 */
router.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    const imageUrls = images.map((img) => ({
      _id: img._id,
      title: img.title,
      createdAt: img.createdAt,
      imageUrl: img.imageUrl,
    }));

    res.json(imageUrls);
  } catch (err) {
    console.error("이미지 목록 오류:", err);
    res.status(500).send("이미지 목록을 불러오지 못했어요.");
  }
});

/**
 * 갤러리 이미지 삭제
 */
router.delete("/image/:id", async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).send("이미지를 찾을 수 없습니다.");

    const fileRef = bucket.file(image.filename);
    await fileRef.delete().catch((err) => {
      console.error("Storage 파일 삭제 실패:", err);
    });

    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("삭제 오류:", err);
    res.status(500).send("서버 오류");
  }
});

module.exports = router;

