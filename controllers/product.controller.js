const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const handler = require("./handlers");
class ProductController {
  /**
   * @desc    Create New Product
   * @route   Post /products
   * @access  Private [Admin]
   * @returns Returns a JSON response with the Created Product
   */
  static createNewProduct = handler.createOne(Product);

  /**
   * @desc    Get All Products
   * @route   GET /products
   * @access  Public
   * @returns Returns a JSON response with the list of products
   */
  static getAllProducts = handler.getAll(Product);

  /**
   * @desc    Get All Products
   * @route   GET /products/:id
   * @access  Public
   * @returns Returns a JSON response with the requested Product
   */
  static getOneProduct = handler.getOne(Product);

  /**
   * @desc    Update Existing Product
   * @route   Put /products/:id
   * @access  Private [Admin]
   * @returns Returns a JSON response with the requested Product
   */
  static updateProduct = handler.updateOne(Product);

  /**
   * @desc    Delete Existing Product
   * @route   Delete /products/:id
   * @access  Private [Admin]
   * @returns Returns a JSON response with the requested Product
   */
  static deleteProduct = handler.deleteOne(Product);
}

module.exports = ProductController;
