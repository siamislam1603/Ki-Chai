import express from "express";
import { getAllServices } from "../../controllers/serviceController.js";
import authRoutes from "./authRoutes.js";

const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);

apiRoutes.get("/services", getAllServices);

export default apiRoutes;
