const Like = require("../models/likeProduct");
const UnLike = require("../models/unlikeProduct");
const AsyncHandler = require("express-async-handler");
const AppError = require(".././error/AppError");
const Product = require("../models/Product");
const expressAsyncHandler = require("express-async-handler");

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

// const mostlike = async (req, res, next) => {
//   const query = req.query.limit || 10;
//   if (isNaN(query)) return next(new AppError("query must be a number"));

//   const data = await Like.aggregate([
//     {
//       $group: {
//         _id: "$product_id",
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { count: -1 },
//     },
//   ]).exec();
//   if (data.length > 1) {
//     res.status(200).json({
//       status: "success",
//       data,
//     });
//   } else {
//     res.status(200).json({
//       status: "success",
//       data,
//     });
//   }
//   console.log(data);
// };

const mostlike = expressAsyncHandler(async (req, res, next) => {
  try {
    const likedbikes = await Like.aggregate([
      {
        $group: {
          _id: "$product_id",
          count: { $sum: 1 }, // counting no. of documents pass
        },
      },
      {
        $sort: { count: -1 },
      },
    ]).exec();

    if (likedbikes.length == 0) {
      return next(new AppError("Not found any like on bike", 404));
    }

    const mostlikeCount = likedbikes[0].count;
    console.log(mostlikeCount);

    const bikeIds = likedbikes.map((bike) => {
      if (mostlikeCount === bike.count) {
        return bike._id;
      }
    }); // Extract bike IDs from aggregation result
    const mostlikedbikes = await Product.find({ _id: { $in: bikeIds } }) // Find bikes with matching IDs
      .populate({
        path: "likes",
        select: "user_id -bike_id -_id",
      })
      .populate({
        path: "likescount",
      })
      .populate({
        path: "dislikes",
        select: "user_id -bike_id -_id",
      })
      .populate({
        path: "dislikescount",
      })
      .populate({
        path: "comments",
        select: "comment  -bike_id -_id",
      })
      .populate({
        path: "commentscount",
      });

    if (mostlikedbikes) {
      res.json({
        data: mostlikedbikes,
      });
    } else {
      return next(new AppError("Bikes are not found", 404));
    }
  } catch (err) {
    console.log("Most recent bike fetching Error", err);
    res.status(404).json({
      status: false,
      message: "Failed to load most liked bikes",
    });
  }
});

module.exports = { likeproduct, mostlike };
