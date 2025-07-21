import express from "express";
import controllers from "./../controllers/doctorController.js";
import { deleteMe } from "./../controllers/userController.js";
import authController, { protect, restrictTo } from "./../controllers/authController.js";
import { injectMe } from "./../controllers/userController.js";
import { createAvailability } from "../controllers/doctorController.js";
import { availabilityDayValidation } from "../validators/availabilityValidators.js";
import userValidation from "../validators/userValidation.js";
const router = express.Router();

router.post("/register", authController.signup);

router.use(protect);

router.route("/").get(controllers.getAllDoctors);
router.route("/:id").get(controllers.getDoctor);

router.use(restrictTo("doctor", "admin"));

router
  .route("/me")
  .get(injectMe, controllers.getDoctor)
  .patch(userValidation.updateMeDoctorValidator, injectMe, controllers.updateDoctor)
  .delete(deleteMe);

router.route("/addAvailability").post(availabilityDayValidation, createAvailability);

export default router;
