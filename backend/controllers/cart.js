const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// Добавление товара в корзину
async function addToCart(userId, productId, quantity = 1) {
  // Добавьте проверку на валидность ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [{ product: productId, quantity }], // Только ID товара
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity }); // Только ID товара
    }
  }

  await cart.save();
  return cart;
}

// Получение корзины пользователя
async function getCart(userId) {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product")
    .lean();

  if (!cart) return [];

  return cart.items.map((item) => ({
    id: item.product?._id?.toString(),
    name: item.product?.name,
    price: item.product?.price || 0, // Значение по умолчанию
    imageUrl: item.product?.imageUrl,
    quantity: item.quantity
  }));
}

// Обновление количества товара
async function updateCartItem(userId, productId, quantity) {
  const cart = await Cart.findOneAndUpdate(
    {
      user: userId,
      "items.product": productId,
    },
    {
      $set: { "items.$.quantity": quantity },
    },
    { new: true }
  ).populate("items.product");

  if (!cart) throw new Error("Cart not found");

  return cart;
}

// Удаление товара из корзины
async function removeFromCart(userId, productId) {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    {
      $pull: { items: { product: productId } },
    },
    { new: true }
  ).populate("items.product");

  return cart;
}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
};
