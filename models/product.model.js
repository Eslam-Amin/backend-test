const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    price: Number,
    quantity: Number,
    createdAt: {
      type: Date,
      default: new Date()
    },
    updatedAt: Date
  }
  /**
   * we Can Use timestamps to add createdAt and updatedAt fields automatically
  { timestamps: true },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
  */
);

// indices to enhance query optimization
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
