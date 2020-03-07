/* eslint-disable require-jsdoc, valid-jsdoc */
const Ajv = require('ajv');
const fs = require('fs');
const log = require('winston');

class ValidationError extends Error {
    constructor(schemaName, errors) {
        super();
        this.name = 'ValidationError';
        this.schemaName = schemaName;
        this.message = this._createMessage(schemaName, errors);
        this.code = 'VALIDATION_ERROR';
    }

    _createMessage(schemaName, errors) {
        return errors.reduce(
            (s, {keyword, dataPath, message}) => s + `${keyword} of ${schemaName}${dataPath} ${message}, `, '');
    }
}

// TODO: tests
/**
 * @class
 * Error and async wrapper for ajv library
 */
class JSONValidator {
    constructor(config) {
        this._config = config;
        const {coerceTypes = true} = config;

        this._validator = new Ajv({
            allErrors: true,
            schemaId: '$id',
            coerceTypes,
        });

        this._loadSchemas();
    }

    _loadSchemas() {
        const {schemasPath} = this._config;
        const files = fs.readdirSync(schemasPath);

        for (const schemaFile of files) {
            const schema = JSON.parse(fs.readFileSync(`${schemasPath}/${schemaFile}`));

            if (this._validator.validateSchema(schema)) {
                this._validator.addSchema(schema);
            } else {
                throw new Error(this._validator.errorsText(this._validator.errors));
            }
        }
    }

    /**
      * Synchronous validation
      * @param {String} schemaId JSON schema id
      * @param {Object} data data to validate
      * @throws {ValidationError} error
      */
    validate(schemaId, data) {
        const validationResult = this._validator.validate(schemaId, data);
        if (!validationResult) {
            log.log(this._validator.errorsText(this._validator.errors));
            throw new ValidationError(schemaId, this._validator.errors);
        }
    }
}

module.exports = JSONValidator;
