require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const uploadRouter = require("./routes/upload");

const path = require("path");

const app = express();
const cors = require("cors");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

app.use("/api", uploadRouter);

// MongoDB 연결
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB 연결 성공"))
  .catch((err) => console.error(" MongoDB 연결 실패:", err));

module.exports = app;
