// import User from "./../models/userModel.js";
// import { jwtVerify, SignJWT } from "jose";
// import jwt from "jsonwebtoken";
// import sendResponse from "./../utils/sendResponse.js";
// import AppError from "./../utils/appError.js";
// import catchAsync from "./../utils/catchAsync.js";
// import crypto from "crypto";
// import sendEmail from "../utils/sendEmail.js";
// import Doctor from "../models/doctorModel.js";

// const createToken = async (user) => {
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
//   user.lastLogin = Date.now() - 1000;
//   await user.save({ validateBeforeSave: false });
//   return token;
// };

// const signup = catchAsync(async (req, res, next) => {
//   const user = req.validatedBody.isDoctor ? await Doctor.create(validatedBody) : await User.create(validatedBody);

//   return user;
// });

// const login = catchAsync(async (req, res, next) => {
//   const user = await User.findOne({ email: req.validatedBody.email }).select("+password");
//   if (!user) {
//     const message = process.env.NODE_ENV === "development" ? "No User Found With This Email" : "incorrect password or email";
//     return next(new AppError(401, message));
//   }

//   const isCorrect = await user.comparePassword(req.validatedBody.password);
//   if (!isCorrect) {
//     const message = process.env.NODE_ENV === "development" ? "Password is Not Correct" : "incorrect password or email";
//     return sendResponse(res, 404, null, null, message);
//   }

//   const token = await createToken(user);

//   sendResponse(res, 200, user, token, "Logged in Successfully!");
// });

// const fogotPassword = catchAsync(async (req, res, next) => {
//   const { email } = req.body;
//   if (!email) return next(new AppError(400, "Provide you email"));

//   const user = await User.findOne({ email });
//   if (!user) return next(new AppError(404, "This User is not exist"));

//   const resetToken = await createResetToken(user);
//   const URL = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;
//   const message = `forgot your password?\nsubmit a POST request to this URL: ${URL}`;
//   try {
//     await sendEmail({ email, message });
//   } catch (error) {
//     user.passwordResetToken = undefined;
//     user.passwordResetTokenExpiresIn = undefined;
//     await user.save({ validateBeforeSave: false });

//     sendResponse(res, 500, null, null, "something went wrong sending email, try again later");
//   }

//   sendResponse(res, 200, null, null, "reset token sent to your email");
// });

// const resetPassword = catchAsync(async (req, res, next) => {
//   const { resetToken } = req.params;
//   const hashedToken = crypto.Hash("sha256").update(resetToken).digest("hex");

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetTokenExpiresIn: { $gt: Date.now() },
//   });

//   if (!user) return next(new AppError(400, "Invalid Token or Expired One."));

//   const { password, passwordConfirm } = req.validatedBody;

//   user.password = password;
//   user.passwordConfirm = passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetTokenExpiresIn = undefined;
//   await user.save();

//   const token = await createToken(user);
//   user.password = undefined;

//   sendResponse(res, 200, user, token, "Password Changed Successfully!");
// });

// export const protect = catchAsync(async (req, res, next) => {
//   const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
//   if (!token) return next(new AppError(401, "Please Login to Perform This Action."));

//   const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
//   const { payload: decoded } = await jwtVerify(token, jwtSecret);
//   const user = await User.findById(decoded.id).select("+password");
//   if (!user) return next(new AppError(401, "User Belonging to This Token is no Longer Exists."));

//   if (user.lastLogin > decoded.iat * 1000) return next(new AppError(401, "This Token is Expired."));
//   req.user = user;
//   next();
// });

// export const restrictTo = (...roles) =>
//   catchAsync(async (req, res, next) => {
//     if (!roles.includes(req.user.role)) return next(new AppError(403, "You Do not have permission to perform this action"));

//     next();
//   });

// const googleOauthHandler = catchAsync(async (req, res, next) => {
//   let user;
//   user = await User.findOne({ email: req.user.email });
//   if (user) {
//     if (!user.googleId) user.googleId = req.user.googleId;
//     if (req.user.photo) user.photo = req.user.photo;
//     await user.save({ validateBeforeSave: false });
//   }
//   if (!user) user = await User.create(req.user);
//   console.log(user);
//   const token = await createToken(user);
//   sendResponse(res, 200, user, token);
// });

// export default { signup, login, protect, restrictTo, fogotPassword, resetPassword, googleOauthHandler };
