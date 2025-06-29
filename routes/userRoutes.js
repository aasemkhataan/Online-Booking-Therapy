import express from "express";
import controllers from "./../controllers/userController.js";
import { protect } from "./../controllers/authController.js";
const router = express.Router();

router.use(protect);
router.route("/me").get(controllers.injectMe, controllers.getUser);

export default router;
