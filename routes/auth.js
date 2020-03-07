const endpoints = require('express').Router();
const handleErrors = require('../middleware/error-handler');

module.exports = commandHandler => {
    endpoints.route('/login')
        .post(handleErrors(async (req, res, next) => {
            const result = await commandHandler.login({
                login: req.body.login,
                password: req.body.password,
            });
            next(result);
        }));
    return endpoints;
};
