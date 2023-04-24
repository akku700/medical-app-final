const mongoose = require("mongoose");

const unlikeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    disLikeCount: {
      type: Number,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
module.exports = mongoose.model("UnLike", unlikeSchema);
