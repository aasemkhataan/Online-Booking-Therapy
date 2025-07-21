import mongoose from "mongoose";

import User from "./userModel.js";
import { string } from "zod/v4";
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
    availability: [
      {
        day: {
          type: String,
          enum: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        startsAt: {
          type: Date,
        },
        duration: {
          type: Number,
          enum: [30, 60],
        },
        isReserved: {
          type: Boolean,
          default: false,
        },
        reservedUntil: Date,
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

doctorSchema.virtual("sessions", {
  ref: "Session",
  foreignField: "doctor",
  localField: "_id",
});

doctorSchema.statics.generateSlots = function (startStr, endStr, duration) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const slots = [];

  const minutes = start.getMinutes();
  if (minutes < 30) {
    start.setMinutes(30, 0, 0);
  } else if (minutes > 30) {
    start.setHours(start.getHours() + 1);
    start.setMinutes(0, 0, 0);
  } else {
    start.setSeconds(0, 0);
  }

  while (start < end) {
    slots.push({
      day: start.toLocaleDateString("en-Us", { weekday: "long" }),
      startsAt: new Date(start),
      duration,
    });

    start.setMinutes(start.getMinutes() + duration);
  }

  return slots;
};

doctorSchema.pre(/^find/, function (next) {
  this.populate("sessions");

  next();
});

doctorSchema.post(/^findOne/, async function (doc, next) {
  let isModified = false;

  doc?.availability.forEach((slot) => {
    if (slot.isReserved && slot.reservedUntil && slot.reservedUntil < Date.now()) {
      slot.isReserved = false;
      slot.reservedUntil = undefined;
      isModified = true;
    }
  });
  if (isModified) await doc.save({ validateBeforeSave: false });

  next();
});

const Doctor = User.discriminator("Doctor", doctorSchema);

export default Doctor;
