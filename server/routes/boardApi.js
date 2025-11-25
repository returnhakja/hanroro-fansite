const express = require("express");
const Board = require("../models/board");

const router = express.Router();

/**
 * 게시글 목록 조회
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Board.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("게시글 목록 오류:", err);
    res.status(500).send("게시글 목록을 불러올 수 없음");
  }
});

/**
 * 게시글 상세 조회
 */
router.get("/:id", async (req, res) => {
  try {
    const post = await Board.findById(req.params.id);
    if (!post) return res.status(404).send("게시글을 찾을 수 없음");

    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error("게시글 조회 오류:", err);
    res.status(500).send("게시글을 불러올 수 없음");
  }
});

/**
 * 게시글 작성
 */
router.post("/", async (req, res) => {
  const { title, content, author, imageUrls } = req.body;
  if (!title || !content || !author) {
    return res.status(400).send("제목, 내용, 작성자는 필수입니다");
  }

  try {
    const newPost = new Board({ title, content, author, imageUrls });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("게시글 작성 오류:", err);
    res.status(500).send("게시글을 저장할 수 없음");
  }
});

/**
 * 게시글 삭제
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Board.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("삭제할 게시글을 찾을 수 없음");

    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("게시글 삭제 오류:", err);
    res.status(500).send("게시글을 삭제할 수 없음");
  }
});

// 좋아요 증가
router.post("/:id/like", async (req, res) => {
  const post = await Board.findById(req.params.id);
  if (!post) return res.status(404).send("게시글 없음");

  post.likes += 1;
  await post.save();

  res.json({ likes: post.likes });
});

module.exports = router;
