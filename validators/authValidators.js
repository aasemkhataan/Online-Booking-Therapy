import { z } from "zod";
import sendResponse from "../utils/sendResponse.js";
import validateBody from "../utils/validateBody.js";

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

const loginSchema = z.object({
  email: z.string().email("Invalid Email Format."),
  password: z.string().min(8),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "password must be at least 8 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: `Passwords Doesn't Match!`,
    path: ["password Confirm"],
  });

const validateSignup = (req, res, next) => {
  req.query?.role === "doctor" ? validateBody(signupDoctorSchema) : validateBody(signupUserSchema);
};
const validateLogin = validateBody(loginSchema);
const validateResetPassword = validateBody(resetPasswordSchema);

export default { validateSignup, validateLogin, validateResetPassword };
