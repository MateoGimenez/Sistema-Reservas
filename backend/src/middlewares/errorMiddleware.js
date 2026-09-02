export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error Interno del Servidor";

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message
  });
};
