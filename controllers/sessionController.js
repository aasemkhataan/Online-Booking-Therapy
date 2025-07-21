import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
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

  if (slot.isReserved && slot.reservedUntil > Date.now())
    throw new AppError(400, "This slot is temporarily reserved. Try again later.");

  return { doctor, slot };
};

const beforeCreate = async (req, res, next) => {
  const { doctor, slot } = await getDoctorAndSlot(req.validatedBody.doctor, req.validatedBody.slotId);

  req.validatedBody.startsAt = slot.startsAt;
  req.validatedBody.duration = slot.duration;
  req.validatedBody.user = req.user._id;

  req.doctor = doctor;
  req.slot = slot;

  return req.validatedBody;
};

const afterCreate = async (session, req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { doctor, slot } = req;

  slot.isReserved = true;
  slot.reservedUntil = Date.now() + 10 * 60 * 1000;

  await doctor.save({ validateBeforeSave: false });

  const line_items = [
    {
      price_data: {
        currency: "egp",
        unit_amount: Math.round((session.duration === 30 ? doctor.halfHourlyRate : doctor.hourlyRate) * 100),
        product_data: {
          name: `Therapy Session ${session.duration} Minutes.`,
          description: doctor.name,
        },
      },
      quantity: 1,
    },
  ];

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `http://127.0.0.1/api/v1/sessions/success?sessionId=${session._id}`,
    cancel_url: `http://127.0.0.1/api/v1/sessions/cancel`,
    client_reference_id: session._id.toString(),
    customer_email: req.user.email,
    line_items,
    metadata: {
      sessionId: session._id.toString(),
      userId: req.user._id.toString(),
      doctorId: doctor._id.toString(),
      slotId: slot._id.toString(),
    },
  });

  session.checkoutSession = checkoutSession.url;

  await session.save({ validateBeforeSave: false });

  return res.redirect(303, checkoutSession.url);
};

const createSession = factory.createOne(Session, {
  beforeCreate,
  afterCreate,
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

    const session = await Session.findByIdAndUpdate(stripeSession.metadata.sessionId, {
      isPaid: true,
      status: "confirmed",
      checkoutSession: undefined,
    });

    const doctor = await Doctor.findById(stripeSession.metadata.doctorId);
    const slot = doctor.availability.find((av) => av._id.toString() === stripeSession.metadata.slotId);

    slot.isReserved = true;
    await doctor.save({ validateBeforeSave: false });

    const user = await User.findById(stripeSession.metadata.userId);

    await sendEmail({
      email: user.email,
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

  if (userId !== sessionUserId && userId !== sessionDoctorId)
    return next(new AppError(403, "You are not authorized to cancel this session."));

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

export default {
  getAllSessions,
  getSession,
  updateSession,
  deleteSession,
  createSession,
  deleteAllSessions,
  cancelSession,
  getAllSessionsAdmin,
  webhookHandler,
};
