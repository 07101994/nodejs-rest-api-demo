/* 
    App Error class for Api error response
    This contract is send in response of the API
    if the request is not processed successfully
*/
class AppError extends Error {
    constructor(statusCode, status, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
    }
}

module.exports = AppError;