import express from "express";
import controllers from "./../controllers/sessionController.js";
import validators from "./../validators/sessionValidators.js";
import { protect } from "./../controllers/authController.js";
import { injectMe } from "../controllers/userController.js";

const router = express.Router();

router.use(protect);
router
  .route("/")
  .get(controllers.getAllSessions)
  .post(validators.createSessionValidation, injectMe, controllers.createCheckoutSession)
  .delete(controllers.deleteAllSessions);

router.route("/:id").get(controllers.getSession).patch(controllers.updateSession);
router.patch("/:id/cancel", controllers.cancelSession);
router.patch("/:id/reschedule", controllers.rescheduleSession);

export default router;
