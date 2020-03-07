const path = require('path');
const Validator = require('../components/validator');
const validator = new Validator({coerceTypes: false, schemasPath: path.resolve(__dirname, '../schemas')});
const BaseError = require('../components/base-error');

// TODO

const validateBody = async (req, res, next) => {
    const {body, method} = req;
    let {originalUrl} = req;

    if (req.query) {
        [originalUrl] = originalUrl.split('?');
    }
    const path = `${method}:${(originalUrl.endsWith('/') ? originalUrl.slice(0, -1) : originalUrl)}`;
    try {
        switch (path) {
            case 'PUT:/users':
                validator.validate('user.update', body);
                break;
            case 'POST:/users':
                validator.validate('user.register', body);
                break;
            case 'POST:/login':
                validator.validate('user.login', body);
                break;
            default:
                break;
        }
        next();
    } catch (error) {
        return next(new BaseError({code: 401, error: error.message}));
    }
};

module.exports = validateBody;


