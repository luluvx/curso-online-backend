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

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.status = 403;
    }
}

module.exports = { BadRequestError, NotFoundError, ForbiddenError };
