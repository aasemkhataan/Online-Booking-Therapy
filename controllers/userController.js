import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import User from "./../models/userModel.js";
import factory from "./handlerFactory.js";

export const injectMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

export default { getAllUsers, getUser, updateUser, deleteUser, injectMe };
