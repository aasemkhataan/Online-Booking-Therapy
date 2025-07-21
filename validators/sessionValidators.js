import { z } from "zod";
import sendResponse from "../utils/sendResponse.js";
import Doctor from "./../models/doctorModel.js";
import validateBody from "../utils/validateBody.js";

const createSessionSchema = z.object({
  slotId: z.string({ required_error: "please select time slot" }),
  doctor: z.string({ required_error: "a session must belong to a doctor" }),
});

const createSessionValidation = validateBody(createSessionSchema);

// const rescheduleSessionSchema = z.object({
//   status: z.string(),
// });

export default { createSessionValidation };
