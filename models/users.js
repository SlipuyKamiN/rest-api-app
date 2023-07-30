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
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

usersSchema.pre("findByIdAndUpdate", handleUpdateValidate);

usersSchema.post("save", handleSaveError);

usersSchema.post("findByIdAndUpdate", handleSaveError);

const User = model("user", usersSchema);

module.exports = User;
