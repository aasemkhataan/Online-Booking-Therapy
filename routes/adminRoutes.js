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
router.route("/users/:id").get(userController.getUser);

// Doctors

router.route("/doctors").get(doctorController.getAllDoctorsAdmin).delete(doctorController.deleteAllDoctors);
router.patch("/doctors/:id/approve", doctorController.approveDoctor);
router.patch("/doctors/:id/suspend", doctorController.suspendDoctor);

router
  .route("/doctors/:id")
  .get(doctorController.getDoctorAdmin)
  .patch(doctorController.updateDoctor)
  .delete(doctorController.deleteDoctor);

// Sessions
router.route("/sessions").get(sessionController.getAllSessions).delete(sessionController.deleteAllSessions);
router
  .route("/sessions/:id")
  .get(sessionController.getSession)
  .patch(sessionController.updateSession)
  .delete(sessionController.deleteSession);

export default router;
