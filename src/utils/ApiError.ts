/* eslint-disable @typescript-eslint/no-explicit-any */
class ApiError extends Error {
   statusCode: any
   message: string
   isOperational: boolean
   stack: string

   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
   constructor(statusCode: any, message: any, isOperational = true, stack: '') {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
export default ApiError;