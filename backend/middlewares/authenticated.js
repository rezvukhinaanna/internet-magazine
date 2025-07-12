const User = require("../models/User");
const { verify } = require("../helpers/token");

module.exports = async function (req, res, next) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ error: "Токен не предоставлен" });
    }
    
    const tokenData = verify(req.cookies.token);
    const user = await User.findOne({ _id: tokenData.id });

    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};