import express from "express";
import controllers, { injectMe } from "./../controllers/userController.js";
import { protect, restrictTo } from "./../controllers/authController.js";
import validators from "./../validators/userValidation.js";
const router = express.Router();

router.use(protect, restrictTo("user"));
router
  .route("/me")
  .get(controllers.injectMe, controllers.getUser)
  .patch(validators.updateMeValidator, injectMe, controllers.updateUser)
  .delete(controllers.deleteMe);

export default router;
