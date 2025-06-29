import mongoose from "mongoose";

import User from "./userModel.js";
const doctorSchema = new mongoose.Schema(
  {
    profession: {
      type: String,
      required: true,
      enum: ["psychiatrist", "therapist"],
    },
    subSpecialty: {
      type: String,
      enum: ["CBT", "Addiction", "Marriage Counseling", "Child Therapy", "General Therapy"],
      default: "General Therapy",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    license: [
      {
        type: String,
        required: [true, "please provide at least one license"],
      },
    ],
    treatedDisorders: {
      type: [
        {
          type: String,
          enum: [
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
          ],
        },
      ],
    },
    hourlyRate: {
      type: Number,
    },
    halfHourlyRate: {
      type: Number,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

doctorSchema.virtual("sessions", {
  ref: "Session",
  foreignField: "doctor",
  localField: "_id",
});

doctorSchema.pre(/^find/, function (next) {
  this.populate("sessions");
  console.log(this);
  next();
});

const Doctor = User.discriminator("Doctor", doctorSchema);

export default Doctor;
