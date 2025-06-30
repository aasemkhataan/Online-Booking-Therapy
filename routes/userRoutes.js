import express from "express";
import controllers, { injectMe } from "./../controllers/userController.js";
import { protect } from "./../controllers/authController.js";
const router = express.Router();

router.use(protect);
router.route("/me").get(controllers.injectMe, controllers.getUser).patch(injectMe, controllers.updateUser);

export default router;
