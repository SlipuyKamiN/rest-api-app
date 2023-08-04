const { Schema, model } = require("mongoose");

const { handleSaveError, handleUpdateValidate } = require("./hooks.js");

const usersSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Missed required email field"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

usersSchema.pre("findByIdAndUpdate", handleUpdateValidate);

usersSchema.post("save", handleSaveError);

usersSchema.post("findByIdAndUpdate", handleSaveError);

const User = model("user", usersSchema);

module.exports = User;
