const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generate } = require("../helpers/token");

// register

async function register(name, email, password) {
  if (!password) {
    throw new Error("Password is empty");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: passwordHash });
  const token = generate({ id: user.id });

  return { user, token };
}

// login

async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Wrong password");
  }

  const token = generate({ id: user.id });

  return { token, user };
}

module.exports = {
  register,
  login,
};
