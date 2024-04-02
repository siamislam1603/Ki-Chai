import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    call_out_for: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Service",
    },
    location: {
      type: String,
      required: true,
    },
    postcode: {
      type: Number,
      required: true,
    },
    expire_at: {
      type: Date,
      required: true,
    },
    is_emergency: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    job_description: {
      type: String,
      required: true,
    },
    is_accepted: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
