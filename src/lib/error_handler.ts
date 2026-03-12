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

export const handleSupabaseError = (error: any): never => {
  if (!error) throw new AppError('An unknown error occurred.');

  const status = error.status || error.code;
  let message = error.message || 'An unexpected error occurred.';

  switch (status) {
    // HTTP Errors
    case 400:
      if (error.message.includes('already registered')) {
        message = 'This email is already taken.';
      } else {
        message = 'Invalid request. Please check your inputs.';
      }
      break;
    case 401:
      message = 'Session expired. Please log in again.';
      break;
    case 404:
      message = 'The requested resource was not found.';
      break;
    case 406:
      message = 'Not acceptable request or rights. Please try again.';
      break;
    case 422:
      message = 'Validation failed. Some data is incorrect or missing.';
      break;
    case 429:
      message = 'Too many requests.';
      break;

    // Supabase/Postgres Specific Codes
    case '23505': // Unique violation
      message = 'This record already exists.';
      break;
    case 'PGRST116': // JSON object requested but none returned
      message = 'Resource not found.';
      break;
    case '42P01':
      message = 'Database configuration error.';
      break;

    default:
      if (status?.toString().startsWith('5')) {
        message = 'Internal server error.';
      }
  }

  throw new AppError(message, status, error);
};
