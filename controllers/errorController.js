import AppError from "../utils/appError.js";
import sendResponse from "../utils/sendResponse.js";
import cloneDeep from "lodash-es/cloneDeep.js";

const sendErrorDev = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};

const sendErrorProd = (res, error) => {
  console.log(error);
  if (error.isOperational) {
    return sendResponse(res, error.statusCode, error, null, error.message, true);
  }
  sendResponse(res, error.statusCode, null, null, "something went very wrong!", true);
};

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path} of value: ${error.value}`;
  return new AppError(400, message);
};

const handleDuplicateKey = (error) => {
  console.log("error", error);
  const fields = Object.keys(error.keyValue);
  return new AppError(400, `Duplicate field value: ${fields}. Please use another value.`);
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development")
    return sendResponse(res, err.statusCode, { err, stack: err.stack }, null, err.message, true);

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateKey(error);

    return sendErrorProd(res, error);
  }
};
