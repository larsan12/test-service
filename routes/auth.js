const endpoints = require('express').Router();
const handleErrors = require('./middleware/error-handler');

module.exports = commandHandler => {
    const {usersDao} = commandHandler;
    endpoints.route('/login')
        .post(handleErrors(async (req, res, next) => {
            const result = await commandHandler.login({
                login: req.body.login,
                password: req.body.password,
            });
            next(result);
        }));
    endpoints.route('/register')
        .post(handleErrors(async (req, res, next) => {
            const result = await usersDao.createUser(req.body);
            next(result);
        }));
    return endpoints;
};
