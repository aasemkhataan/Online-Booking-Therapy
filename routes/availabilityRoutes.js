import express from "express";
import controllers from "./../controllers/availabilityController.js";
import validators from "./../validators/availabilityValidators.js";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router({ mergeParams: true });

router.use(protect);

router.route("/").get(controllers.getDoctorSlots);

router.use(restrictTo("doctor", "admin"));

router.post("/generateSlots", validators.availabilityDayValidation, controllers.generateSlots);
router.post("/addSlots", validators.addSlots, controllers.addSlots);

router.route("/:slotId").delete(controllers.deleteSlot);

export default router;
