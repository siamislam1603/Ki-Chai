import asyncHandler from "express-async-handler";
import Service from "../models/Service.js";

export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().lean();
  return res.status(200).json({ data: { services } });
});
