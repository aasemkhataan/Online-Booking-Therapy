import sendResponse from "../utils/sendResponse.js";

const sendErrorProd = (res, error) => {
  if (error.isOperational) {
    return sendResponse(res, error.statusCode, null, null, error.message);
  }
  sendResponse(res, error.statusCode, null, null, "something went very wrong!");
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "error";

  if (process.env.NODE_ENV === "production") return sendErrorProd(res, err);
  console.error("ERROR 💥", err);

  sendResponse(res, err.statusCode, { error: err, stack: err.stack }, null, err.message);
};
