import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    public message: string,
    public status?: string | number,
    public originalError?: any,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleSupabaseError = (error: any): AppError => {
  if (!error) throw new AppError('An unknown error occurred.');

  const status = error.status || error.code;
  let message = error.message || 'An unexpected error occurred.';

  switch (status) {
    // HTTP Errors
    case 401:
      message = 'Session expired. Please log in again.';
      break;
    case 403:
    case 406:
      message = "You don't have permission to do this.";
      break;

    default:
      const statusNumber = status ? Number(status) : null;
      if (statusNumber && statusNumber >= 500 && statusNumber < 600) {
        message = 'Internal server error.';
      } else if (
        error.code === '23505' ||
        error.includes('unique constraint')
      ) {
        message = 'This record already exists.';
      }
  }
  toast.error(message);
  return new AppError(message, status, error);
};
