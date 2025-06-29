import { z } from "zod";
import sendResponse from "../utils/sendResponse.js";

const baseSignupSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(10),
  email: z.string({ required_error: "Email is required" }).email("Invalid Email Format."),
  password: z.string({ required_error: "Password is required" }).min(8, "Password must be 8 characters or more."),
  passwordConfirm: z.string({ required_error: "PasswordConfirm is required" }),
});

const signupUserSchema = baseSignupSchema.refine((data) => data.password === data.passwordConfirm, {
  message: `Passwords Don't Match!`,
  path: ["passwordConfirm"],
});

const signupDoctorSchema = baseSignupSchema
  .extend({
    license: z
      .array(z.string(), { required_error: "please provide at least one license" })
      .min(1, "Please provide at least one license"),
    profession: z.enum(["psychiatrist", "therapist"], {
      required_error: "Please select a profession",
    }),
    subSpecialty: z.string().optional(),
    treatedDisorders: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: `Passwords Don't Match!`,
    path: ["passwordConfirm"],
  });

const validateSignup = (req, res, next) => {
  const role = req.query?.role === "doctor" ? "doctor" : "user";
  const schema = role === "doctor" ? signupDoctorSchema : signupUserSchema;

  let result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(400).json({
      status: "fail",
      errors,
    });
  }

  req.validatedBody = result.data;
  req.validatedBody.role = role;
  next();
};

const loginSchema = z.object({
  email: z.string().email("Invalid Email Format."),
  password: z.string().min(8),
});

const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return sendResponse(res, 400, errors);
  }
  req.validatedBody = result.data;
  next();
};

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "password must be at least 8 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: `Passwords Doesn't Match!`,
    path: ["password Confirm"],
  });
const validateResetPassword = (req, res, next) => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    // sendResponse(res, 400, result.error);
    const errors = result.error.errors.map((err) => ({ field: err.path, message: err.message }));
    sendResponse(res, 400, errors);
  }
  req.validatedBody = result.data;
  next();
};

export default { validateSignup, validateLogin, validateResetPassword };
