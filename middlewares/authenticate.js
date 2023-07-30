const { HttpError } = require("../utils/HttpError");
const jwt = require("jsonwebtoken");
const { ctrlWrapper } = require("../utils/ctrlWrapper");
require("dotenv/config");
const User = require("../models/users");

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    next();
  } catch (error) {
    console.log(error);
    throw HttpError(401, "Not authorized");
  }
};

module.exports = {
  authenticate: ctrlWrapper(authenticate),
};
