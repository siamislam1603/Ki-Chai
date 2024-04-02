import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: Number,
      required: true,
    },
    postcode: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    reset_password_token: {
      type: String,
      required: true,
    },
    reset_password_token_expiration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
