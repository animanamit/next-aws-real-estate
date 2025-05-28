import { Request, Response, NextFunction } from 'express';

export interface TypedRequest<T = any> extends Request {
  params: T;
}

export interface TypedResponse extends Response {}

export type AsyncHandler<T = any> = (
  req: TypedRequest<T>,
  res: TypedResponse,
  next: NextFunction
) => Promise<void>;