import express from "express";
import validators from "../validators/authValidators.js";
import controllers from "./../controllers/authController.js";
import passport from "passport";
const router = express.Router();

router.post("/signup", validators.validateSignup, controllers.signup);
router.post("/login", validators.validateLogin, controllers.login);
router.post("/forgotPassword", controllers.fogotPassword);
router.post("/resetPassword/:resetToken", validators.validateResetPassword, controllers.resetPassword);
router.get("/google", passport.authenticate("google"));
router.get("/google/callback", passport.authenticate("google", { session: false }), controllers.googleOauthHandler);

export default router;
