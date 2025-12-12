const express = require("express");
const Board = require("../models/board");
const { bucket } = require("../firebase");

const router = express.Router();

const extractFirebaseFilename = (url) => {
  if (!url || typeof url !== "string") return null;
  const prefix = `https://storage.googleapis.com/${bucket.name}/`;
  if (!url.startsWith(prefix)) return null;
  const filename = decodeURIComponent(url.slice(prefix.length));
  if (!filename.startsWith("board/")) return null;
  return filename;
};

const deleteFilesFromFirebase = async (urls) => {
  const filenames = (urls || [])
    .map(extractFirebaseFilename)
    .filter(Boolean);

  await Promise.all(
    filenames.map((name) =>
      bucket.file(name).delete().catch((err) => {
        console.error("Firebase 파일 삭제 실패:", name, err);
      })
    )
  );
};

/**
 * 게시글 목록 조회
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Board.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("게시글 목록 오류:", err);
    res.status(500).send("게시글 목록을 불러오지 못했어요.");
  }
});

/**
 * 게시글 상세 조회 (조회수 증가)
 */
router.get("/:id", async (req, res) => {
  try {
    const post = await Board.findById(req.params.id);
    if (!post) return res.status(404).send("게시글을 찾을 수 없습니다.");

    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error("게시글 조회 오류:", err);
    res.status(500).send("게시글을 불러오지 못했어요.");
  }
});

/**
 * 게시글 생성
 */
router.post("/", async (req, res) => {
  const { title, content, author, imageUrls } = req.body;
  if (!title || !content || !author) {
    return res.status(400).send("제목, 내용, 작성자는 필수입니다.");
  }

  try {
    const newPost = new Board({ title, content, author, imageUrls });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("게시글 생성 오류:", err);
    res.status(500).send("게시글을 작성하지 못했어요.");
  }
});

/**
 * 게시글 수정
 * - 기존 imageUrls와 비교해서 제거된 URL에 해당하는 Firebase 파일 삭제
 */
router.put("/:id", async (req, res) => {
  const { title, content, author, imageUrls } = req.body;
  if (!title || !content || !author) {
    return res.status(400).send("제목, 내용, 작성자는 필수입니다.");
  }

  try {
    const existing = await Board.findById(req.params.id);
    if (!existing) return res.status(404).send("게시글을 찾을 수 없습니다.");

    const prevUrls = existing.imageUrls || [];
    const nextUrls = Array.isArray(imageUrls) ? imageUrls : [];
    const removedUrls = prevUrls.filter((u) => !nextUrls.includes(u));

    const updated = await Board.findByIdAndUpdate(
      req.params.id,
      { title, content, author, imageUrls: nextUrls },
      { new: true }
    );
    if (!updated) return res.status(404).send("게시글을 찾을 수 없습니다.");

    if (removedUrls.length > 0) {
      await deleteFilesFromFirebase(removedUrls);
    }

    res.json(updated);
  } catch (err) {
    console.error("게시글 수정 오류:", err);
    res.status(500).send("게시글을 수정하지 못했어요.");
  }
});

/**
 * 게시글 삭제
 * - 연결된 Firebase 이미지도 같이 삭제
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Board.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("삭제할 게시글을 찾을 수 없습니다.");

    if (deleted.imageUrls && deleted.imageUrls.length > 0) {
      await deleteFilesFromFirebase(deleted.imageUrls);
    }

    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("게시글 삭제 오류:", err);
    res.status(500).send("게시글을 삭제하지 못했어요.");
  }
});

/**
 * 좋아요 증가
 */
router.post("/:id/like", async (req, res) => {
  const post = await Board.findById(req.params.id);
  if (!post) return res.status(404).send("게시글이 없습니다.");

  post.likes += 1;
  await post.save();

  res.json({ likes: post.likes });
});

module.exports = router;

