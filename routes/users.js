const endpoints = require('express').Router();
const handleErrors = require('./middleware/error-handler');

module.exports = commandHandler => {
    const {usersDao} = commandHandler;
    endpoints.route('/users-list')
        .get(handleErrors(async (req, res, next) => {
            const data = await usersDao.getUsers(req.query);
            next(data);
        }));
    return endpoints;
};
