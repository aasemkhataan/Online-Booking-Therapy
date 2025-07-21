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
