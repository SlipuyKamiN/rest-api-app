const Joi = require("joi");

const emptySchema = Joi.object()
  .min(1)
  .messages({ "object.min": "Missing fields" });

const usersSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"))
    .required()
    .messages({
      "any.required": "Email is required",
      "string.pattern.base": "Wrong pattern",
    }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Set password for user",
    "string.pattern.base": "Wrong pattern",
  }),
});

module.exports = {
  emptySchema,
  usersSchema,
};
