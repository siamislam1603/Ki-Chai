import express from "express";
import { getAllServices } from "../../controllers/serviceController.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);

apiRoutes.get("/services", getAllServices);

apiRoutes.use("/user", verifyJWT, userRoutes);

export default apiRoutes;
