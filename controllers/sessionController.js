import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import TempBooking from "../models/tempBookingModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/sendEmail.js";
import sendResponse from "../utils/sendResponse.js";
import Session from "./../models/sessionModel.js";
import { checkAuthority } from "./authController.js";
import factory from "./handlerFactory.js";
import Stripe from "stripe";

const getAllSessions = factory.getAll(Session, { filterByUser: true });
const getSession = factory.getOne(Session);
const updateSession = factory.updateOne(Session);
const deleteSession = factory.deleteOne(Session);
const deleteAllSessions = factory.deleteAll(Session);
const getAllSessionsAdmin = factory.getAll(Session);

const getDoctorAndSlot = async (doctorId, slotId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new AppError(404, "Doctor not found");

  const slot = doctor.availability.find((av) => av._id.toString() === slotId);
  if (!slot) throw new AppError(400, "This Time Slot is Not Available.");
  if (slot.isReserved) throw new AppError(400, "This Slot is reserved.");
  if (slot.isReserved && slot.reservedUntil > Date.now()) throw new AppError(400, "This slot is reserved. Try again later.");

  return { doctor, slot };
};

const createStripeCheckout = async (req, slot, doctor, tempBooking) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: Math.round((slot.duration === 30 ? doctor.halfHourlyRate : doctor.hourlyRate) * 100),
          product_data: {
            name: doctor.name,
            description: `${slot.duration}-minute session`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${req.protocol}://${req.get("host")}/api/v1/success`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cancel`,
    metadata: {
      tempBookingId: tempBooking._id.toString(),
      doctorId: doctor._id.toString(),
      slotId: slot._id.toString(),
      userId: req.user._id.toString(),
      userEmail: req.user.email,
    },
  });

  return session;
};

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { slotId, doctorId } = req.validatedBody;
  const { slot, doctor } = await getDoctorAndSlot(doctorId, slotId);

  const tempBooking = await TempBooking.create({
    slot: slotId,
    doctor: doctorId,
    user: req.user._id,
  });
  slot.isReserved = true;
  slot.reservedUntil = Date.now() + 10 * 60 * 1000;
  await doctor.save({ validateBeforeSave: false });

  const session = await createStripeCheckout(req, slot, doctor, tempBooking);

  sendResponse(res, 201, { sessionUrl: session.url });
});

export const webhookHandler = catchAsync(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return next(new AppError(400, err.message));
  }

  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object;

    const tempSession = await TempBooking.findById(stripeSession.metadata.tempBookingId);
    if (!tempSession) return next(new AppError(404, "Temp Booking not found!"));

    const { doctor, slot } = await getDoctorAndSlot(stripeSession.metadata.doctorId, stripeSession.metadata.slotId);

    const session = await Session.create({
      user: tempSession.user,
      doctor: tempSession.doctor,
      status: "confirmed",
      slot: slot._id,
      duration: slot.duration,
      startsAt: slot.startsAt,
      isPaid: true,
    });

    slot.isReserved = true;
    slot.reservedUntil = undefined;
    await doctor.save({ validateBeforeSave: false });

    const userEmail = stripeSession.metadata.userEmail;

    await sendEmail({
      email: userEmail,
      subject: "Session Confirmed",
      message: "Your payment is success and your session is confirmed",
    });

    await sendEmail({
      email: doctor.email,
      subject: "Session Confirmed",
      message: "slot is reserved be ready to meet the patient",
    });
  }

  res.status(200).json({ recieved: true });
});
const cancelSession = catchAsync(async (req, res, next) => {
  const session = await Session.findById(req.params.id);
  if (!session) return next(new AppError(404, "No session found with this ID"));

  const userId = req.user._id.toString();
  const sessionUserId = session.user.toString();
  const sessionDoctorId = session.doctor.toString();

  if (userId !== sessionUserId && userId !== sessionDoctorId) return next(new AppError(403, "You are not authorized to cancel this session."));

  session.status = "cancelled";
  await session.save();

  const reciever = sessionDoctorId === userId ? await User.findById(sessionUserId) : await Doctor.findById(sessionDoctorId);
  const message = `Dear ${reciever.name},

We would like to inform you that the session scheduled on ${session.startsAt} has been cancelled.

If you have any questions or need to reschedule, please feel free to contact us.

Best regards,  
Shezlong Support Team `;

  await sendEmail({
    email: reciever.email,
    subject: "session cancelled",
    message,
  });

  const doctor = await Doctor.findById(sessionDoctorId);

  const slot = doctor.availability.find((av) => av.startsAt.getTime() === session.startsAt.getTime());
  slot.isReserved = false;
  await doctor.save({ validateBeforeSave: false });

  sendResponse(res, 200, session, null, "Session cancelled successfully");
});

const rescheduleSession = catchAsync(async (req, res, next) => {
  const session = await Session.findById(req.params.id);
  const { doctor, slot: newSlot } = await getDoctorAndSlot(session.doctor, req.body.slot);
  const oldSlot = session.slot;

  doctor.availability.id(oldSlot).isReserved = false;
  doctor.availability.id(newSlot).isReserved = true;
  session.slot = newSlot;
  await session.save({ validateBeforeSave: false });
  await doctor.save({ validateBeforeSave: false });

  sendResponse(res, 200, session, null, "Session rescheduled Successfully.");
});

export default {
  getAllSessions,
  getSession,
  updateSession,
  deleteSession,
  createCheckoutSession,
  deleteAllSessions,
  cancelSession,
  getAllSessionsAdmin,
  webhookHandler,
  rescheduleSession,
};
