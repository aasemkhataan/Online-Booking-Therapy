import { z } from "zod";
import sendResponse from "../utils/sendResponse.js";
import Doctor from "./../models/doctorModel.js";

const createSessionSchema = z.object({
  duration: z.number({ required_error: "please choose the session duration" }),
  startsAt: z.preprocess((val) => new Date(val), z.date()),
  doctor: z.string({ required_error: "a session must belong to a doctor" }),
});

const createSessionValidation = async (req, res, next) => {
  const result = createSessionSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({ field: err.path, message: err.message }));
    return sendResponse(res, 400, errors);
  }

  req.validatedBody = result.data;

  if (req.user.role !== "user") return sendResponse(res, 403, null, null, "Only users can create sessions");
  req.validatedBody.user = req.user._id;

  const doctor = await Doctor.findById(result.data.doctor);
  if (!doctor || doctor.role !== "doctor") return sendResponse(res, 403, null, null, "sessions Only With Doctors");
  next();
};

const rescheduleSessionSchema = z.object({
  status: z.string(),
});

export default { createSessionValidation };
