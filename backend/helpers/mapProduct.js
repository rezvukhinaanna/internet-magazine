module.exports = function (product) {
  return {
    id: product.id,
    imageUrl: product.image_url,
    category: product.category,
    name: product.name,
    author: product.author,
    price: product.price,
    discount: product.discount,
    material: product.material,
    year: product.year,
    pages: product.pages,
    stars: product.stars,
    reviews: product.reviews,
    details: product.details,
    description: product.description,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
