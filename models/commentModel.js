const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
  },
  createBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
});

module.exports = new mongoose.model("Comment", commentSchema);
