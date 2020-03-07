const endpoints = require('express').Router();
const handleErrors = require('../middleware/error-handler');

module.exports = commandHandler => {
    const {usersDao} = commandHandler;
    endpoints.route('/users')
        .get(handleErrors(async (req, res, next) => {
            const data = await usersDao.getUsers(req.query);
            next(data);
        }))
        .put(handleErrors(async (req, res, next) => {
            const data = await usersDao.updateUser(req.body);
            next(data);
        }))
        .post(handleErrors(async (req, res, next) => {
            const result = await usersDao.createUser(req.body);
            next(result);
        }));
    return endpoints;
};
