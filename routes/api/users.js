const express = require("express");

const router = express.Router();
const ctrl = require("../../controllers/auth");
const schemas = require("../../schemas/users");
const { validateBody } = require("../../middlewares/validateBody");
const isEmptyBody = require("../../middlewares/isEmptyBody");
const isValidId = require("../../middlewares/isValidId");

router.post(
  "/register",
  validateBody(schemas.emptySchema),
  validateBody(schemas.usersSchema),
  ctrl.register
);

router.post(
  "/login",
  validateBody(schemas.emptySchema),
  validateBody(schemas.usersSchema),
  ctrl.login
);

module.exports = router;
