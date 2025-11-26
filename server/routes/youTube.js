// routes/youTube.js
const express = require("express");
const router = express.Router();

router.get("/videos", async (req, res) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.CHANNEL_ID;

    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=5`;
    console.log(url);
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("YouTube API 호출 실패:", err);
    res.status(500).json({ error: "YouTube API 호출 실패" });
  }
});

module.exports = router;
