import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';

export const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler = (
  error: ErrorRequestHandler,
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'wrong credentials' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'invalid token' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }
  return next(error);
};

// export const tokenExtractor = (request: Request, response: Response, next: NextFunction) => {
//   const auth = request.get('authorization');
//   if (auth && auth.startsWith('Bearer ')) {
//     request.token = auth.replace('Bearer ', '');
//   }
//   next();
// };
