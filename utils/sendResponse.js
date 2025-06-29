const sendResponse = (res, statusCode, data, token, message) => {
  const response = {};

  if (Array.isArray(data)) response.results = data.length;
  response.status = `${statusCode}`.startsWith("2") ? "success" : "fail";
  if (response.status === "success" && data) response.data = data;
  if (response.status === "fail" && data) {
    response.errors = {
      message: data.message,
      ...data,
    };
  }
  if (token) response.token = token;
  if (message) response.message = message;
  res.status(statusCode).json(response);
};

export default sendResponse;
