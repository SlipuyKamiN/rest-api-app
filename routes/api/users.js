const express = require("express");

const router = express.Router();
const ctrl = require("../../controllers/auth");
const schemas = require("../../schemas/users");
const { validateBody } = require("../../middlewares/validateBody");
const { authenticate } = require("../../middlewares/authenticate");

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
router.get("/current", authenticate, ctrl.getCurrent);
router.post("/logout", authenticate, ctrl.logOut);

module.exports = router;
