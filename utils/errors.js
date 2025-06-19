class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
    class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}
module.exports = { BadRequestError, NotFoundError };
