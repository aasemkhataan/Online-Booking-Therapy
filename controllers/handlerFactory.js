import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { checkAuthority } from "./authController.js";

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.validatedBody);
    sendResponse(res, 201, doc, null, `${Model.modelName} Created Successfully!`);
  });

const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) return next(new AppError(404, `No ${Model.modelName} Found With This ID.`));

    sendResponse(res, 200, doc, null);
  });

const getAll = (Model, options) =>
  catchAsync(async (req, res, next) => {
    let filter = options?.filterByUser ? { user: req.user._id } : null;

    const features = new APIFeatures(Model.find(filter), req.query).sort().filter().limitFields().paginate();

    const docs = await features.mongooseQuery;
    sendResponse(res, 200, docs, null);
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, validatedBody, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError(404, `No ${Model.modelName} Found With This ID.`));

    sendResponse(res, 200, doc, null);
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError(404, `No ${Model.modelName} Found With This ID.`));

    sendResponse(res, 204);
  });

const deleteAll = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.deleteMany();
    sendResponse(res, 204);
  });

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  deleteAll,
};
