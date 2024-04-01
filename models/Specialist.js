import mongoose from "mongoose";

const specialistSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    postcode: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: String,
      required: true,
    },
    emergency_service: {
      type: Boolean,
      required: true,
    },
    nid_picture: {
      type: String,
      required: true,
    },
    user_description: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpiration: {
      type: Number,
      required: false,
    },
    per_hour_rate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Specialist = mongoose.model("Specialist", specialistSchema);

export default Specialist;
