import express from "express";
import controllers from "./../controllers/doctorController.js";
import { protect } from "./../controllers/authController.js";
import { injectMe } from "./../controllers/userController.js";
const router = express.Router();

router.use(protect);

router.route("/").get(controllers.getAllDoctors);
router.route("/:id").get(controllers.getDoctor);
router.route("/me").get(injectMe, controllers.getDoctor).patch(injectMe, controllers.updateDoctor);
export default router;
