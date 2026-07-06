class ApiEror extends Error {
    constructor(statusCode,
         message = "Something went wrong",
         error =[],
         stack = ""
        ) 
         {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.stack = stack; 
        this.data = null;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default ApiError;