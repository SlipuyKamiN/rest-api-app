const { HttpError } = require("../utils/HttpError");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const JWT_SECRET = process.env;

const isValidToken = (req, res, next) => {
  const token = req.header("Authorization");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log(error);
    next(HttpError(401, "Not authorized"));
  }
  next();
};

module.exports = {
  isValidToken,
};
