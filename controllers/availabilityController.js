import Doctor from "../models/doctorModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";

const filterNotAvailableSlots = (slots, availabilityArray) => {
  const unavailableStarts = new Set(availabilityArray.map((av) => new Date(av.startsAt).getTime()));

  const availbleSlots = slots.filter((slot) => !unavailableStarts.has(new Date(slot.startsAt).getTime()));

  return availbleSlots;
};

const getDoctorSlots = catchAsync(async (req, res, next) => {
  const doctorId = req.params.doctorId || req.user._id;

  const doctor = await Doctor.findById(doctorId);

  const slots = doctor.availability;

  sendResponse(res, 200, slots);
});

const generateSlots = catchAsync(async (req, res, next) => {
  const { startStr, endStr, duration } = req.validatedBody;

  const newSlots = Doctor.generateSlots(startStr, endStr, duration);

  const filteredSlots = filterNotAvailableSlots(newSlots, req.user.availability);
  if (!filteredSlots.length) return next(new AppError(400, "All slots are Already exists!"));

  req.user.availability.push(...filteredSlots);
  await req.user.save({ validateBeforeSave: false });

  sendResponse(res, 201, { addedSlots: filteredSlots }, null, `${filteredSlots.length} slot(s) added successfully`);
});

const addSlots = catchAsync(async (req, res, next) => {
  const filterdSlots = filterNotAvailableSlots(req.validatedBody, req.user.availability);

  if (!filterdSlots.length) return next(new AppError(400, "All slots are Already exists!"));

  req.user.availability.push(...filterdSlots);
  await req.user.save({ validateBeforeSave: false });

  sendResponse(res, 201, filterdSlots, null, "Slot Addes Successfully!");
});

const deleteSlot = catchAsync(async (req, res, next) => {
  const slot = req.user.availability.id(req.params.slotId);

  if (!slot) return next(new AppError(404, "Slot Not Found in your availability"));

  slot.remove();
  await req.user.save({ validateBeforeSave: false });

  sendResponse(res, 204);
});

export default {
  generateSlots,
  getDoctorSlots,
  deleteSlot,
  addSlots,
};
