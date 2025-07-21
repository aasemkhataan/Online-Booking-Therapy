const sendResponse = (res, statusCode, data, token, message, isError) => {
  const response = {};

  if (Array.isArray(data)) response.results = data.length;

  if (isError) {
    if (`${statusCode}`.startsWith("4")) response.status = "fail";
    else response.status = "error";

    response.error = data;
  } else {
    response.status = "success";
    response.data = data;
  }
  if (message) response.message = message;

  if (token) response.token = token;
  res.status(statusCode).json(response);
};

export default sendResponse;
