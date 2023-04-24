const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "name not provided"],
  },
  productType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductType",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  parDay: {
    type: String,
    required: [true, "day per dose not provided"],
  },
  expiryDate: {
    type: String,
    required: [true, "expiry date not provided"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
    required: [true, "image is not provided"],
  },
});

module.exports = new mongoose.model("Product", productSchema);
