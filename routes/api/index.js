import express from "express";
import authRoutes from "./authRoutes.js";

const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);

export default apiRoutes;
