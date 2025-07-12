require('dotenv').config()
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { register, login } = require("./controllers/user");
const mapUser = require("./helpers/mapUser");
const {
  addProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProduct,
} = require("./controllers/product");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require("./controllers/cart");
const mapProduct = require("./helpers/mapProduct");
const authenticated = require("./middlewares/authenticated");

const port = 3001;
const app = express();

app.use(cors({
  origin: "http://localhost:3006",
  credentials: true
}));

app.use(express.static("../frontend/build"));

app.use(cookieParser());
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const { user, token } = await register(
      req.body.name,
      req.body.email,
      req.body.password
    );

    res
      .cookie("token", token, { httpOnly: true })
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { user, token } = await login(req.body.email, req.body.password);

    res
      .cookie("token", token, { httpOnly: true })
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
});

// Products routes
app.get("/products", async (req, res) => {
  const { products, lastPage } = await getProducts(
    req.query.search,
    req.query.limit,
    req.query.page,
    req.query.minPrice,
    req.query.maxPrice,
    req.query.category
  );

  res.send({ data: { lastPage, products: products.map(mapProduct) } });
});



app.get("/products/:id", async (req, res) => {
  try {
    const product = await getProduct(req.params.id);

    res.send({ error: null, product: mapProduct(product) });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
});

app.use(authenticated);

app.post("/products", async (req, res) => {
  try {
    const product = await addProduct(req.body);

    res.send({ error: null, product: mapProduct(product) });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
});

app.patch("/products/:id", async (req, res) => {
  try {
    const product = await editProduct(req.params.id, req.body);

    res.send({ error: null, product: mapProduct(product) });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await deleteProduct(req.params.id);

    res.send({ error: null });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
});

// Добавить товар в корзину
app.post("/cart", async (req, res) => {
  try {
    const cart = await addToCart(
      req.user.id,
      req.body.productId,
      req.body.quantity || 1
    );
    res.send({ error: null, cart });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

// Получить корзину
app.get("/cart", async (req, res) => {
  try {
    const cart = await getCart(req.user.id);
    res.send({ error: null, ...cart });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

// Обновить количество товара
app.patch("/cart/:productId", async (req, res) => {
  try {
    const cart = await updateCartItem(
      req.user.id,
      req.params.productId,
      req.body.quantity
    );
    res.send({ error: null, cart });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

// Удалить товар из корзины
app.delete("/cart/:productId", async (req, res) => {
  try {
    const cart = await removeFromCart(req.user.id, req.params.productId);
    res.send({ error: null, cart });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
});

mongoose
  .connect(
    process.env.DB_CONNECTION_STRING
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  });
