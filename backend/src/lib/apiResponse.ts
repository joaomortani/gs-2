import type { Response } from 'express';

type ErrorCode = string | null;

type ErrorMessage = string | null;

export interface ApiError {
  code: ErrorCode;
  message: ErrorMessage;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError;
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: { code: null, message: null },
  });
};

export const sendError = <T>(
  res: Response,
  statusCode: number,
  error: ApiError,
  data: T | null = null,
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: false,
    data,
    error,
  });
};
