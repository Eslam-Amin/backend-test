const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");
class ProductValidator {
  static validateAddProduct = [
    // Name is required and should be a string.
    body("name")
      .exists()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),

    // Category is optional but should be a string if provided.
    body("category").optional().isString().withMessage("Category must be a string"),

    // Price should be a positive number.
    body("price")
      .exists()
      .withMessage("Price is required")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),

    // Quantity should be a non-negative integer.
    body("quantity")
      .exists()
      .withMessage("Quantity is required")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer")
  ];

  static validateUpdateProduct = [
    // Name is optional, but if provided, it must be a string.
    body("name").optional().isString().withMessage("Name must be a string"),

    // Category is optional, but if provided, it must be a string.
    body("category").optional().isString().withMessage("Category must be a string"),

    // Price is required and must be a positive number (update might require price change).
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be a positive number"),

    // Quantity is required and must be a non-negative integer (update might require quantity change).
    body("quantity")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer")
  ];

  static checkProductExistence = asyncHandler(async (req, res, next) => {
    let { id: productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return next(new ApiError("Product is not found", 404));
    req.existingProduct = product;
    next();
  });
}

module.exports = ProductValidator;
