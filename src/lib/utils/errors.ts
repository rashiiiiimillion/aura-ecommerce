export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleActionError(error: unknown) {
  console.error("[Action Error]:", error);

  if (error instanceof AppError) {
    return { error: error.message, status: error.statusCode };
  }
  
  if (error instanceof Error) {
    return { error: error.message, status: 500 };
  }

  return { error: "An unexpected error occurred", status: 500 };
}
