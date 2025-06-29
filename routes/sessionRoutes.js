import express from "express";
import controllers from "./../controllers/sessionController.js";
import validators from "./../validators/sessionValidators.js";
import { protect } from "./../controllers/authController.js";

const router = express.Router();

router.use(protect);
router
  .route("/")
  .get(controllers.getAllSessions)
  .post(validators.createSessionValidation, controllers.createSession)
  .delete(controllers.deleteAllSessions);

router.route("/:id").get(controllers.getSession).patch(controllers.updateSession);
router.route("/:id/cancel").patch(controllers.cancelSession);
export default router;
