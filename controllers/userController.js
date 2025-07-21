import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import User from "./../models/userModel.js";
import factory from "./handlerFactory.js";

export const injectMe = (req, res, next) => {
  req.params.id = req.user._id;
  req.body.user = req.user._id;
  req.validatedBody.user = req.user._id;

  next();
};

export const deleteMe = catchAsync(async (req, res, next) => {
  req.user.isActive = false;
  await req.user.save({ validateBeforeSave: false });

  sendResponse(res, 204);
});

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

export default { getAllUsers, getUser, updateUser, deleteUser, injectMe, deleteMe };
