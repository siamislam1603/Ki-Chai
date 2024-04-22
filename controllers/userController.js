import asyncHandler from "express-async-handler";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { deSelectUserColumns } from "../util/const.js";

export const getUserDashboard = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.userId })
    .select(deSelectUserColumns)
    .lean();
  const upcomingJobs = await Job.find({
    customer: req.userId,
    is_accepted: true,
    expire_at: { $gt: new Date() },
  })
    .populate([
      {
        path: "call_out_for",
        select: deSelectUserColumns,
        populate: [
          { path: "specialist", populate: [{ path: "interests" }] },
          { path: "vendor" },
        ],
      },
    ])
    .lean();
  res.status(200).json({ data: { user, upcomingJobs } });
});
