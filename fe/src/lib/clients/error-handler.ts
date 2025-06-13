import { ApiErrorResponse } from '@/types/common-type';
import { convertToSnakeCase } from '../utils/string-helper';

/**
 * Helper function to handle errors
 * @param error - Error caught from catch block
 * @param defaultMessage - Default message when error type is not identified
 * @returns
 */
export function handleError(error: unknown, defaultMessage = 'some_thing_went_wrong'): string {
  let messageError = defaultMessage;

  if (error instanceof Error) {
    messageError = error.message;
  }

  if (error && typeof error === 'object') {
    const apiError = error as ApiErrorResponse;

    if ('message' in apiError && typeof apiError.message === 'string') {
      messageError = apiError.message;
    }

    // Handle case with validation errors
    if ('errors' in apiError && apiError.errors && typeof apiError.errors === 'object') {
      // Get message from first validation error
      const firstErrorArray = Object.values(apiError.errors)[0];
      if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
        messageError = firstErrorArray[0];
      }
    }
  }

  // If error is string, return it
  if (typeof error === 'string') {
    messageError = error;
  }

  // Convert to snake_case
  return convertToSnakeCase(messageError);
}
