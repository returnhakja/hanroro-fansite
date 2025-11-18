const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  title: String,
  filename: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
