import { z } from "zod";
import sendResponse from "../utils/sendResponse.js";
import validateBody from "../utils/validateBody.js";

const availabilityDaySchema = z.object({
  startStr: z.string(),
  endStr: z.string(),
  duration: z.number({ required_error: "please provide availability duration" }).refine((val) => val === 30 || val === 60, {
    message: "duration must be either 30 or 60",
  }),
});

export const availabilityDayValidation = validateBody(availabilityDaySchema);

export default {
  availabilityDayValidation,
};
