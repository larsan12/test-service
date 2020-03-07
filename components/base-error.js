/* eslint-disable require-jsdoc, valid-jsdoc */
class BaseError extends Error {
    error;
    code;

    /**
     * @param {number} code
     * @param {string} error
     * @param {object} formErrors? - for react forms
     */
    constructor({code = 500, error, formErrors = null}) {
        super();

        this.code = code;
        this.error = error;
        if (formErrors) {
            this.formErrors = formErrors;
        }
    }
}

module.exports = BaseError;
