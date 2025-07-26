import { z } from "zod";
import validateBody from "../utils/validateBody.js";

const updateMeSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  photo: z.string().optional(),
});

const updateMeDoctorSchema = updateMeSchema.extend({
  profession: z.enum(["psychiatrist", "therapist"]).optional(),
  subSpecialty: z.enum(["CBT", "Addiction", "Marriage Counseling", "Child Therapy", "General Therapy"]).optional(),
  license: z.array(z.string().min(1)).optional(),
  treatedDisorders: z
    .array(
      z.enum([
        "Depression",
        "Anxiety",
        "OCD",
        "PTSD",
        "Bipolar Disorder",
        "ADHD",
        "Panic Disorder",
        "Eating Disorders",
        "Schizophrenia",
        "Sleep Disorders",
        "Addiction",
        "Personality Disorders",
        "Marriage Issues",
        "Child Behavior Issues",
      ]),
    )
    .optional(),

  hourlyRate: z.number().optional(),
  halfHourlyRate: z.number().optional(),
});

const updateMeValidator = validateBody(updateMeSchema);
const updateMeDoctorValidator = validateBody(updateMeDoctorSchema);

export default { updateMeValidator, updateMeDoctorValidator };
