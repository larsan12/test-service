const log = require('@bb/stack_log');

module.exports = func => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        log.error(error);
        next(error);
    }
};
