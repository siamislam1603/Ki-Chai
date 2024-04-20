import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getUserDashboard = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.userId }).select("-password");
  res.status(200).json({ data: { user } });
});
