const Product = require("../models/Product");

// add
async function addProduct(product) {
  const newProduct = await Product.create(product);
  return newProduct;
}

// edit
async function editProduct(id, product) {
  const updatedProduct = await Product.findByIdAndUpdate(id, product, {
    returnDocument: "after",
  });
  return updatedProduct;
}

// delete
function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

// get list with search and pagination
async function getProducts(search = "", limit = 10, page = 1, minPrice, maxPrice, category) {
  const skip = (page - 1) * limit;
  
  const query = { name: { $regex: search, $options: "i" } };
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  // Добавляем фильтрацию по категории если параметр передан
  if (category && ['books', 'telescopes', 'other'].includes(category)) {
    query.category = category;
  }

  const [products, count] = await Promise.all([
    Product.find(query)
      .limit(limit)
      .skip(skip),
    Product.countDocuments(query),
  ]);

  return {
    products: products,
    lastPage: Math.ceil(count / limit),
  };
}

// get item
function getProduct(id) {
  return Product.findById(id);
}

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProduct,
};
