import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/sendEmail.js";
import sendResponse from "../utils/sendResponse.js";
import Session from "./../models/sessionModel.js";
import { checkAuthority } from "./authController.js";
import factory from "./handlerFactory.js";

const getAllSessions = factory.getAll(Session, { filterByUser: true });
const getSession = factory.getOne(Session);
const createSession = factory.createOne(Session);
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
