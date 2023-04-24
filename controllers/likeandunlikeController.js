const Like = require("../models/likeProduct");
const UnLike = require("../models/unlikeProduct");
const AsyncHandler = require("express-async-handler");
const AppError = require(".././error/AppError");
const Product = require("../models/productModel");
const { query } = require("express");

const likeproduct = AsyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError("product not found", 400));
    }

    const existinglike = await Like.findOne({
      user_id: req.user.id,
      product_id: id,
    });
    if (existinglike) {
      const like = await Like.findOneAndRemove({
        user_id: req.user.id,
        product_id: id,
      });
      await UnLike.create({
        user_id: req.user.id,
        product_id: id,
      });
      return res.status(201).json({
        msg: "Successfully disliked this product",
        like,
      });
    }
    const existingDislike = await UnLike.findOne({
      user_id: req.user.id,
      product_id: id,
    });
    if (existingDislike) {
      const like = await UnLike.findOneAndRemove({
        user_id: req.user.id,
        product_id: id,
      });
      await Like.create({
        user_id: req.user.id,
        product_id: id,
      });
      return res.status(201).json({
        msg: "Successfully liked this product",
        like,
      });
    }
    const like = await Like.create({
      user_id: req.user.id,
      product_id: id,
    });
    res.status(201).json({
      msg: "successfully liked this product",
      like,
    });
  } catch (err) {
    return next(new AppError("some thing went wrong in like controller", 400));
  }
});

const mostlike = async (req, res, next) => {

  const query = req.query.limit || 1;
  if (isNaN(query)) return next(new AppError("query must be a number"));

  const data = await Like.aggregate([
    {
      $group: {
        _id: "$product_id",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: +query,
    },
  ]).exec();

  res.status(200).json({
    status: "success",
    data,
  });
};

module.exports = { likeproduct, mostlike };
