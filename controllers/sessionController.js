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
const createSession = factory.createOne(Session, {
  afterCreate: async (session, req, res, next) => {
    const doctor = await Doctor.findById(session.doctor);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      },
    });

    sendResponse(res, 200, checkoutSession);
  },
});
const updateSession = factory.updateOne(Session);
const deleteSession = factory.deleteOne(Session);
const deleteAllSessions = factory.deleteAll(Session);
const getAllSessionsAdmin = factory.getAll(Session);

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
  sendResponse(res, 200, session, null, "Session cancelled successfully");
});

const checkoutSession = catchAsync(async (req, res, next) => {});
export default {
  getAllSessions,
  getSession,
  updateSession,
  deleteSession,
  createSession,
  deleteAllSessions,
  cancelSession,
  getAllSessionsAdmin,
};
