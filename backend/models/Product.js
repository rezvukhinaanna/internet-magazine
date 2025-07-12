const mongoose = require("mongoose");
const validator = require("validator");

const ProductSchema = mongoose.Schema(
  {
    image_url: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: "Image should be a valid url",
      },
    },
    category: {
      type: String,
      required: true,
      enum: ["telescopes", "books", "other"],
      default: "books"
    },
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    pages: {
      type: Number,
      required: false,
    },
    stars: {
      type: Number,
      required: true,
    },
    reviews: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
