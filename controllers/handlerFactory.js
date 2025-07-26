import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { checkAuthority } from "./authController.js";
import AppError from "../utils/appError.js";

const createOne = (Model, hooks = {}) =>
  catchAsync(async (req, res, next) => {
    if (hooks.beforeCreate) req.validatedBody = await hooks.beforeCreate(req, res, next);

    let doc = await Model.create(req.validatedBody);

    if (hooks.afterCreate) doc = await hooks.afterCreate(doc, req, res, next);

    sendResponse(res, 201, doc, null, `${Model.modelName} Created Successfully!`);
  });

const getOne = (Model, filter = {}) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ _id: req.params.id, ...filter });
    console.log(filter);
    if (!doc) return next(new AppError(404, `No ${Model.modelName} Found With This ID.`));

    sendResponse(res, 200, doc, null);
  });

const getAll = (Model, filter = {}) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(filter), req.query).sort().filter().limitFields().paginate();

    const docs = await features.mongooseQuery;

    sendResponse(res, 200, docs, null);
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
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
