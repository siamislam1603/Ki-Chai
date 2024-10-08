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
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postcode: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    profile: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    otp: {
      type: Number,
    },
    account_verify_token: {
      type: String,
    },
    account_verify_token_expiration: {
      type: Number,
    },
    reset_password_token: {
      type: String,
    },
    reset_password_token_expiration: {
      type: Number,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialist",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
