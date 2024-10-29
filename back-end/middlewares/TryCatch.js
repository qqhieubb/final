const TryCatch = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      let statusCode = 500;
      let message = error.message;

      if (error.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error: " + Object.values(error.errors).map((err) => err.message).join(", ");
      } else if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
      } else if (error.code === 11000) {
        statusCode = 400;
        message = "Duplicate value error: " + JSON.stringify(error.keyValue);
      }

      res.status(statusCode).json({
        message,
      });
    }
  };
};

export default TryCatch;
