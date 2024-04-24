import express from "express";
import multer from "multer";
import * as userController from "../../controllers/userController.js";

const userRoutes = express.Router();

const upload = multer();

userRoutes.get("/dashboard", userController.getUserDashboard);
userRoutes.get("/professionals", userController.getProfessionals);
userRoutes.post("/post-job", upload.none(), userController.postJob);

export default userRoutes;
