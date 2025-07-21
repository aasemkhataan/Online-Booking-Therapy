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

const addSlotSchema = z.array(
  z.object({
    day: z.enum(["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
    startsAt: z.string({ required_error: "please provide slot start time" }),
    duration: z
      .number("please choose slot duration 30 or 60 minutes")
      .refine((val) => val === 30 || val === 60, { message: "you can only choose between 30 or 60 minutes" }),
  }),
);

export const availabilityDayValidation = validateBody(availabilityDaySchema);
export const addSlots = validateBody(addSlotSchema);
export default {
  availabilityDayValidation,
  addSlots,
};
