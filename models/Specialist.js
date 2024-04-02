import mongoose from "mongoose";

const specialistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    per_hour_rate: {
      type: Number,
      required: true,
    },
    nid_picture: {
      type: [String],
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
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Specialist = mongoose.model("Specialist", specialistSchema);

export default Specialist;
