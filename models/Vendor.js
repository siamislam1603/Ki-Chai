import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    per_hour_rate: {
      type: Number,
      required: true,
    },
    company_reg_certificate: {
      type: String,
      required: true,
    },
    user_description: {
      type: String,
      required: true,
    },
    is_available_for_emergency: {
      type: Boolean,
      required: true,
    },
    interests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
