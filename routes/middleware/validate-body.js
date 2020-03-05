const path = require('path');
const Validator = require('../../components/validator');
const validator = new Validator({coerceTypes: false, schemasPath: path.resolve(__dirname, '../../components/schemas')});

// TODO

const validateBody = async (req, res, next) => {
    const {body} = req;
    try {
        // TODO
        // await validator.validate('main_schema', body);
        // await validator.validate(schema, body.params);
        next();
    } catch (error) {
        return next({ok: false, error: 'CLIENT_ERROR', description: error});
    }
};

module.exports = validateBody;


