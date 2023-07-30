const User = require("../models/users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const { HttpError } = require("../utils/HttpError");
const { ctrlWrapper } = require("../utils/ctrlWrapper");

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { body } = req;

  const isUser = await User.findOne(body);

  if (isUser) throw HttpError(409, "Email in use");

  const { email, subscription } = await User.create({
    email: body.email,
    password: await bcryptjs.hash(body.password, 10),
  });

  res.status(201).json({ user: { email, subscription } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const passwordCompare = await bcryptjs.compare(password, user.password);

  if (!user || !passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
