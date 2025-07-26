import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    duration: {
      type: Number,
      enum: [30, 60],
    },
    startsAt: {
      type: Date,
      required: [true, "please provide start date of the session"],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor.availability",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ["card"],
      default: "card",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "cancelled"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "a session must belong to a user"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "a session must belong to a doctor"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true },
);

sessionSchema.virtual("endsAt").get(function () {
  return new Date(this.startsAt.getTime() + this.duration * 60 * 1000);
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
