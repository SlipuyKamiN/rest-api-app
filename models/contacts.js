const { Schema, model } = require("mongoose");

const { handleSaveError, handleUpdateValidate } = require("./hooks.js");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.pre("findByIdAndUpdate", handleUpdateValidate);

contactSchema.post("save", handleSaveError);

contactSchema.post("findByIdAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

module.exports = Contact;
