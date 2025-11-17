const express = require("express");
const cors = require("cors");
const uploadRouter = require("./routes/upload");

const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api", uploadRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
