const Product = require(".././models/productModel");
const ProductType = require(".././models/productTyepModel");
const AppError = require(".././error/AppError");
const AsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
// const { default: mongoose } = require("mongoose");

const createProduct = AsyncHandler(async (req, res, next) => {
  // console.log(req.files);
  const { name, productType, parDay, expiryDate } = req.body;

  const productFind = await Product.find({ name: req.body.name });

  if (productFind.length > 0) {
    return next(new AppError("Product All_Ready Exist"));
  }
  let product_typeid;

  const product_type = await ProductType.find({ name: productType });
  // console.log(product_type);

  if (!product_type.length) {
    return next(new AppError("product type not exist", 400));
  } else {
    product_typeid = product_type[0]._id;
  }
  // console.log(product_typeid , product_type)

  const product = await Product.create({
    name,
    parDay,
    expiryDate,
    productType: product_typeid,
    image: req.files.image[0].filename,
  });

  if (product) {
    return res.status(200).json({
      status: "success",
      product: product,
    });
  } else {
    return next(new AppError("Something went wrong", 400));
  }
});

const getAllProduct = AsyncHandler(async (req, res, next) => {
  const All_Product = await Product.find({});

  if (All_Product) {
    return res.status(200).json({
      status: "success",
      All_Product,
    });
  } else {
    return next(new AppError("something went wrong", 400));
  }
});

const UpDateProduct = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new AppError("ID is invalid", 400));

  const update_product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!update_product) {
    return next(new AppError("product not updated or not found", 400));
  } else {
    return res.status(200).json({
      status: "success",
      update_product,
    });
  }
});

const deleteProduct = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new AppError("ID is invalid", 400));

  const product_true = await Product.findById(id);

  if (!product_true) {
    return next(new AppError("Product Id not found please try again", 400));
  }
  const delete_Product = await Product.findByIdAndDelete(id);
  if (deleteProduct) {
    return res.status(200).json({
      status: "success",
      massage: "product was successfully deleted",
    });
  } else {
    return next(AppError("Product Id not found please try again", 400));
  }
});


const getProductByProductsTypes = AsyncHandler(async (req, res, next) => {
  
  const id = req.params.id;
  // console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new AppError("ID is invalid", 400));
  
  
  const typeExists = await ProductType.find({ _id: id });
  // console.log(typeExists);
  if (typeExists.length == 0)
    return next(new AppError("Product type does not exist"));

  const Products = await Product.find({ productType: id });
  if (Products) {
    return res.status(200).json({
      status: "success",
      data: Products,
    });
  } else {
    return next(new AppError("does not have any product with this type", 400));
  }
});

const getMostRecentProduct = AsyncHandler(async (req, res, next) => {
  const get_Recent = await Product.find({});

  get_Recent.sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    else return -1;
  });
  res.status(201).json({ status: "success", data: get_Recent[0] });
});

module.exports = {
  createProduct,
  getAllProduct,
  UpDateProduct,
  deleteProduct,
  getProductByProductsTypes,
  getMostRecentProduct,
};
