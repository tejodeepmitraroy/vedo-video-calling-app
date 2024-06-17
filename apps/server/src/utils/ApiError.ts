class ApiError extends Error {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  errors: never[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    data: any = null,
    errors = [],
    stack = ""
  ) {
    super();
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
