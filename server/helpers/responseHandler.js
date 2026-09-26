const ResponseHandler = (res, code, success, message, data = null) => {
  return res.status(code).json({
    success,
    message,
    data,
  });
};

module.exports = { ResponseHandler };
