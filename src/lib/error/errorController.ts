import { NextRequest, NextResponse } from "next/server";

const sendErrorDev = (
  err: Record<string, any>,
  _req: NextRequest
) => ({
  status: err.status,
  error: err,
  message: err.message,
  stack: err.stack,
  metadata: {
    timestamp: new Date().toISOString(),
  },
});

const sendErrorProd = (
  err: Record<string, any>,
  _req: NextRequest
) => ({
  status: err.status,
  message: err.message,
  metadata: {
    timestamp: new Date().toISOString(),
  },
});

const errorFunction = (
  err: Record<string, any>,
  req: NextRequest,
  _res: NextResponse
) => {
  const statusCode = err.statusCode || err.status || 500;
  const status = err.status || "error";

  const error = {
    ...err,
    statusCode,
    status,
    message: err.message || "An unexpected error occurred.",
  };

  const responseBody =
    process.env.NODE_ENV !== "production"
      ? sendErrorDev(error, req)
      : sendErrorProd(error, req);

  return NextResponse.json(responseBody, {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default errorFunction;
