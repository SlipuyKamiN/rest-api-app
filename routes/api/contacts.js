const express = require("express");

const router = express.Router();
const ctrl = require("../../controllers/contacts");
const schemas = require("../../schemas/contacts");
const { validateBody } = require("../../middlewares/validateBody");
const isEmptyBody = require("../../middlewares/isEmptyBody");
const isValidId = require("../../middlewares/isValidId");
const { isValidToken } = require("../../middlewares/isValidToken");

router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post(
  "/",
  isValidToken,
  validateBody(schemas.contactSchema),
  ctrl.createNew
);

router.patch(
  "/:contactId/favorite",
  validateBody(schemas.isValidId),
  isValidId,
  isEmptyBody,
  ctrl.updateStatusContact
);

router.delete("/:contactId", ctrl.deleteById);

router.put(
  "/:contactId",
  validateBody(schemas.emptySchema),
  validateBody(schemas.contactSchema),
  ctrl.updateById
);

module.exports = router;
