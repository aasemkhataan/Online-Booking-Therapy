import express from "express";
import controllers from "./../controllers/userController.js";
import { protect, restrictTo } from "./../controllers/authController.js";
import userController from "./../controllers/userController.js";
import doctorController from "./../controllers/doctorController.js";
import sessionController from "../controllers/sessionController.js";
const router = express.Router();

router.use(protect);
// router.use(restrictTo("admin"));

// Users

router.route("/users").get(userController.getAllUsers);
router.route("/doctors").get(doctorController.getAllDoctors);
router.route("/sessions").get(sessionController.getAllSessions).delete(sessionController.deleteAllSessions);
export default router;
