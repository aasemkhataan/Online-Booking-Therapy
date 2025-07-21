import express from "express";
import controllers from "./../controllers/doctorController.js";
import { deleteMe } from "./../controllers/userController.js";
import authController, { protect, restrictTo } from "./../controllers/authController.js";
import { injectMe } from "./../controllers/userController.js";
import userValidation from "../validators/userValidation.js";
import availabilityRouter from "../routes/availabilityRoutes.js";

const router = express.Router();

router.use("/:doctorId/availability", availabilityRouter);

router.post("/register", authController.signup);

router.use(protect);

router
  .route("/me")
  .get(injectMe, controllers.getDoctor)
  .patch(userValidation.updateMeDoctorValidator, injectMe, controllers.updateDoctor);

router.route("/").get(controllers.getAllDoctors);
router.route("/:id").get(controllers.getDoctor);

export default router;
