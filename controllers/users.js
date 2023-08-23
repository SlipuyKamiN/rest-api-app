const User = require("../models/users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
require("dotenv/config");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const { HttpError } = require("../utils/HttpError");
const { ctrlWrapper } = require("../utils/ctrlWrapper");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../utils/sendEmail");

const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { body } = req;

  const isUser = await User.findOne({ email: body.email });

  if (isUser) throw HttpError(409, "Email in use");
  const avatarURL = gravatar.url(body.email, { s: "200" }, true);

  const verificationToken = nanoid();

  const { email, subscription } = await User.create({
    email: body.email,
    password: await bcryptjs.hash(body.password, 10),
    avatarURL,
    verificationToken,
  });

  sendEmail({
    to: email,
    subject: "Registration verification",
    html: `<p>Please <a rel="_blank noopener"href="${BASE_URL}/users/verify/${verificationToken}">verify</a> your email.`,
  });

  res.status(201).json({ user: { email, subscription } });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify || !user.verificationToken) {
    throw HttpError(400, "Verification has already been passed");
  }

  sendEmail({
    to: email,
    subject: "Repeated verification",
    html: `<p>Please <a rel="_blank noopener"href="${BASE_URL}/users/verify/${user.verificationToken}">verify</a> your email.`,
  });

  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email has not been verified");
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logOut = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const {
    user: { _id },
    body: { subscription },
  } = req;

  const user = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  res.json({ email: user.email, subscription: user.subscription });
};

const avatarPath = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
  const {
    user: { _id },
    file: { path: oldPath, filename },
  } = req;

  const newPath = path.join(avatarPath, filename);

  await Jimp.read(oldPath)
    .then((lenna) => {
      return lenna
        .resize(250, 250)
        .color([{ apply: "saturate", params: [60] }])
        .write(newPath);
    })
    .catch(console.error);

  fs.unlink(oldPath);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logOut: ctrlWrapper(logOut),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  resendVerify: ctrlWrapper(resendVerify),
};
