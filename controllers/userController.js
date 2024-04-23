import asyncHandler from "express-async-handler";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { professionalsFilterSchema } from "../schemas/userValidation.js";
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

export const getProfessionals = asyncHandler(async (req, res) => {
  const { service_type, city, postcode, expire_at } =
    await professionalsFilterSchema().parseAsync(req.query);
  const professionals = await User.aggregate([
    {
      $match: {
        $or: [{ vendor: { $exists: true } }, { specialist: { $exists: true } }],
      },
    },
    {
      $lookup: {
        from: "vendors", // Assuming the collection name for vendors is "vendors"
        localField: "vendor",
        foreignField: "_id",
        as: "vendor",
      },
    },
    {
      $lookup: {
        from: "specialists", // Assuming the collection name for specialists is "specialists"
        localField: "specialist",
        foreignField: "_id",
        as: "specialist",
      },
    },
    {
      $match: {
        $or: [
          { "vendor.interests": service_type },
          {
            "specialist.interests": service_type,
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    data: {
      totalProfessionals: professionals.length,
      professionals,
    },
  });
});
