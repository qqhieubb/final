class createError extends Error {
    constructor(message, statusCode) {
        // Call the parent class (Error) constructor with the message
        super(message);
        
        // Add a status code property
        this.statusCode = statusCode;
        
        // Set the status property based on the status code
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        
        // // Mark operational errors to differentiate them from programming or other unknown errors
        // this.isOperational = true;
        
        // Capture the stack trace (excluding the constructor call itself)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = createError;
