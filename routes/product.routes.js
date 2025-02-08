const express = require("express");
// Constants
const { ADMIN } = require("../utils/constants");

// Auth middlewares
const { protect, allowedTo } = require("../middlewares/auth.middleware");

// Middlewares
const validationCheck = require("../middlewares/validationCheck.middleware");

// Classes
const ProductController = require("../controllers/product.controller");
const ProductValidator = require("../validators/product.validator");

// Router
const router = express.Router();

// Routes
router.route("/").get(ProductController.getAllProducts);

router
  .route("/")
  .get(ProductController.getAllProducts)
  .post(
    protect,
    allowedTo(ADMIN),
    ProductValidator.validateAddProduct,
    validationCheck,
    ProductController.createNewProduct
  );

router
  .route("/:id")
  .get(ProductController.getOneProduct)
  .put(
    protect,
    allowedTo(ADMIN),
    ProductValidator.validateUpdateProduct,
    validationCheck,
    ProductController.updateProduct
  )
  .delete(protect, allowedTo(ADMIN), ProductController.deleteProduct);

module.exports = router;
