class ApiError extends Error {
	statusCode: number;
	data: unknown;
	message: string;
	success: boolean;
	errors: never[];

	constructor(
		statusCode: number,
		message: string = 'Something went wrong',
		data: unknown = null,
		errors = [],
		stack = ''
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
