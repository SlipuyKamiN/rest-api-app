const express = require("express");
const multer = require("multer");
const path = require("path");

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const { originalname } = file;
    const uniquePreffix = `${Date.now()}-${Math.random(Math.round() * 1e9)}`;
    const filename = `${uniquePreffix}_${originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const upload = multer({ storage, limits });

module.exports = upload;
