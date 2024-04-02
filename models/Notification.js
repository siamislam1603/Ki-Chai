import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Job",
  },
  description: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    immutable: true,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
