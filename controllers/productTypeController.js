// const  json  = require('express');
const AsyncHandler = require("express-async-handler");
const ProductType = require("../models/productTyepModel");
const AppError = require(".././error/AppError");
const Product = require("../models/productModel");

const createProductType = AsyncHandler(async (req, res, next) => {
  
  const name = req.body.name;
  if (!name) return next(new AppError("Name is Not Mentioned", 400));

  const pro = await ProductType.findOne({ name });
  if (pro) return next(new AppError("ProductType Already Exists", 400));

  const productCreate = await ProductType.create({
    name,
    user: req.user.id,
    image: req.file,
  });

  if (productCreate) {
    res.status(200).json({
      status: "success",
      message: "Product created successfully",
    });
  } else {
    return next(new AppError("product dose not created ", 400));
  }
});

const allProductType = AsyncHandler(async (req, res, next) => {
  const allProducts = await ProductType.find();

  if (allProducts) {
    res.json({
      status: "success",
      allProducts,
    });
  } else {
    return next(new AppError("Product not found ", 400));
  }
});

const deleteProductType = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new AppError("Product ID not found ", 400));
  }

  const product_del = await ProductType.findOne({ _id: id });

  if (!product_del) {
    return next(new AppError("product type not exit", 400));
  }
  const products = await Product.find({ productType: req.params.id });

  if (products.length) {
    return next(
      new AppError(
        "Can not delete ProductType product already exist on this type",
        400
      )
    );
  }
  const Product_define = await ProductType.findByIdAndDelete(req.params.id);

  if (!Product_define) {
    return next(new AppError("Unable to delete this type", 400));
  }

  res.status(200).json({
    msg: "Product Type successfully deleted",
  });
});

module.exports = { createProductType, allProductType, deleteProductType };
