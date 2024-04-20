import express from "express";
import * as userController from "../../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get("/dashboard", userController.getUserDashboard);

export default userRoutes;
