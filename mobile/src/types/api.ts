export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string | null;
    message: string | null;
  };
}

