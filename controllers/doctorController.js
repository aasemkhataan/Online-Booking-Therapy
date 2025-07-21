import Doctor from "../models/doctorModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import factory from "./handlerFactory.js";
import sendResponse from "../utils/sendResponse.js";

const getAllDoctors = factory.getAll(Doctor, { status: "approved" });
const getAllDoctorsAdmin = factory.getAll(Doctor);
const getDoctor = factory.getOne(Doctor, { status: "approved" });
const getDoctorAdmin = factory.getOne(Doctor);
const updateDoctor = factory.updateOne(Doctor);
const deleteDoctor = factory.deleteOne(Doctor);
const deleteAllDoctors = factory.deleteAll(Doctor);

export const createAvailability = catchAsync(async (req, res, next) => {
  const { startStr, endStr, duration } = req.validatedBody;

  const doctor = await Doctor.findById(req.user._id);
  if (!doctor) return next(new AppError(404, "Doctor Not Found"));

  const newSlots = Doctor.generateSlots(startStr, endStr, duration);

  const filtered = newSlots.filter((slot) => {
    return !doctor.availability.find((av) => new Date(av.startsAt).getTime() === new Date(slot.startsAt).getTime());
  });
  doctor.availability.push(...filtered);
  await doctor.save({ validateBeforeSave: false });

  if (!filtered.length) return next(new AppError(400, "All slots are already exist"));

  sendResponse(res, 201, doctor, null, `${filtered.length} slot(s) added successfully`);
});

const approveDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    {
      new: true,
    },
  );

  if (!doctor) return next(new AppError(404, "No Doctor Found With This ID!"));

  sendResponse(res, 200, doctor, null, "Doctor had Approved successfully!");
});

const suspendDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { status: "suspended" },
    {
      new: true,
    },
  );

  if (!doctor) return next(new AppError(404, "No Doctor Found With This ID!"));

  sendResponse(res, 200, doctor, null, "Doctor had suspended successfully!");
});
export default {
  getAllDoctors,
  getAllDoctorsAdmin,
  getDoctor,
  getDoctorAdmin,
  updateDoctor,
  deleteDoctor,
  deleteAllDoctors,
  approveDoctor,
  suspendDoctor,
};
