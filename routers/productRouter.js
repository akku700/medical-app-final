const express = require("express");
const router = express.Router();
const productTypeController = require(".././controllers/productTypeController");
const validateToken = require("../middlewares/validateToken");
const productController = require(".././controllers/productController");
const upload = require("../middlewares/uploadphoto");

// productType ###############

router.get("/getallType", productTypeController.allProductType);
router.post(
  "/createType",
  validateToken,
  productTypeController.createProductType
);
router.delete("/deleteById/:id", productTypeController.deleteProductType);

// product ####################
router.get("/getAll", productController.getAllProduct);
router.post(
  "/create",
  upload.fields([{ name: "image" }]),
  // upload.single("image"),
  productController.createProduct
);
router.patch("/ById/:id", productController.UpDateProduct);
router.delete("/ById/:id", productController.deleteProduct);

// getProductByProductsTypes  ###################

router.get("/productById/:id", productController.getProductByProductsTypes);

// getMostRecentProduct ###################

router.get("/Recent", productController.getMostRecentProduct);
module.exports = router;
