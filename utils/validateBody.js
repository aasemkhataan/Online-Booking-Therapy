import sendResponse from "./sendResponse.js";

const validateBody = (schema) => async (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({ field: err.path, message: err.message }));
    return sendResponse(res, 400, errors, null, null, true);
  }

  req.validatedBody = result.data;
  next();
};

export default validateBody;
