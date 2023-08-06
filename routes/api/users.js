const express = require("express");

const router = express.Router();
const ctrl = require("../../controllers/users");
const schemas = require("../../schemas/users");
const { validateBody } = require("../../middlewares/validateBody");
const { authenticate } = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

router.post(
  "/register",
  validateBody(schemas.emptySchema),
  validateBody(schemas.usersSchema),
  ctrl.register
);

router.get("/verify/:verificationToken", ctrl.verify);
router.post("/verify", validateBody(schemas.emailSchema), ctrl.resendVerify);

router.post(
  "/login",
  validateBody(schemas.emptySchema),
  validateBody(schemas.usersSchema),
  ctrl.login
);
router.get("/current", authenticate, ctrl.getCurrent);
router.post("/logout", authenticate, ctrl.logOut);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.emptySchema),
  validateBody(schemas.subscriptionSchema),
  ctrl.updateSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  ctrl.updateAvatar
);

module.exports = router;
