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
  const { service_type, limit, search, page, is_available_for_emergency } =
    await professionalsFilterSchema().parseAsync(req.query);
  const professionals = await User.aggregate([
    {
      $match: {
        $or: [{ vendor: { $exists: true } }, { specialist: { $exists: true } }], // select only professionals not customers
        $or: [
          { first_name: { $regex: `.*${search}.*`, $options: "i" } }, // filter professionals using search value
          { last_name: { $regex: `.*${search}.*`, $options: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "vendors", // Parent table that contains vendor id"
        localField: "vendor", // field of the table I've been using aggregate piplelines
        foreignField: "_id", // Vendor table primary key that's been referred in the User table
        as: "vendor", // vendor table data will be stored in this field
      },
    },
    {
      $lookup: {
        from: "specialists",
        localField: "specialist",
        foreignField: "_id",
        as: "specialist",
      },
    },
    {
      $match: {
        $or: [
          { "vendor.0.interests": service_type }, // interests contain this value
          {
            "specialist.0.interests": service_type,
          },
        ],
        $or: [
          { "vendor.0.is_available_for_emergency": is_available_for_emergency }, // filter by is_available_for_emergency value
          {
            "specialist.0.is_available_for_emergency":
              is_available_for_emergency,
          },
        ],
      },
    },
    {
      $group: {
        _id: null, // group everything into a single document
        total: {
          $sum: 1, // total professionals length count
        },
        professionals: {
          $push: "$$ROOT", // added new field named professionals & pushed each professional object in the array
        },
      },
    },
    {
      $project: {
        _id: 0, // remove this column from the documents
        total: 1, // add this column in the documents
        professionals: {
          $slice: ["$professionals", (page - 1) * limit, limit], // paginated professional based on limit & page no.
        },
        last_page: { $ceil: { $divide: ["$total", limit] } }, // last page no. calculated
      },
    },
    {
      $addFields: {
        current_page: {
          $cond: {
            if: { $gt: [page, "$last_page"] }, // if current_page > last_page then value should be null otherwise the current_page
            then: null,
            else: page,
          },
        },
      },
    },
  ]);

  res.status(200).json({
    data: {
      ...professionals[0],
    },
  });
});

export const postJob = asyncHandler(async (req, res) => {
  
});
