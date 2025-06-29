import Doctor from "../models/doctorModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import factory from "./handlerFactory.js";
import sendResponse from "../utils/sendResponse.js";

const getAllDoctors = factory.getAll(Doctor);
const getDoctor = factory.getOne(Doctor);
const updateDoctor = factory.updateOne(Doctor);
const deleteDoctor = factory.deleteOne(Doctor);

export default {
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
};
