import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    service_type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
