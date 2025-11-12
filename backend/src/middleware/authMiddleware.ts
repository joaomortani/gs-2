import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { sendError } from '../lib/apiResponse';


function unauthorized(res: Response): void {
  sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.header('authorization');

  if (!authorization) {
    unauthorized(res);
    return;
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    unauthorized(res);
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret);

    if (typeof decoded !== 'object' || decoded === null) {
      unauthorized(res);
      return;
    }

    const payload = decoded as jwt.JwtPayload & { userId?: string };
    const userId = payload.sub ?? payload.userId;

    if (!userId || typeof userId !== 'string') {
      unauthorized(res);
      return;
    }

    req.user = { id: userId };
    next();
  } catch (error) {
    unauthorized(res);
  }
}
