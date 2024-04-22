import express from "express";
import * as userController from "../../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get("/dashboard", userController.getUserDashboard);
userRoutes.get("/professionals", userController.getProfessionals);

export default userRoutes;
