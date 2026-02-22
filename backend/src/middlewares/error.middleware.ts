import { Request, Response } from 'express';

type AppErrorLike = {
  statusCode?: number;
  message?: string;
};

function isAppError(err: unknown): err is AppErrorLike {
  return typeof err === 'object' && err !== null && ('statusCode' in err || 'message' in err);
}

export const errorMiddleware = (err: unknown, req: Request, res: Response) => {
  // log the original error for debugging
  // console.error(err);

  let status = 500;
  let message = 'Internal Server Error';

  if (isAppError(err)) {
    if (typeof err.statusCode === 'number') status = err.statusCode;
    if (typeof err.message === 'string' && err.message.length) message = err.message;
  } else if (err instanceof Error) {
    // standard Error has a message
    message = err.message || message;
  }

  res.status(status).json({
    success: false,
    message,
  });
};
