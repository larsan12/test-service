/* eslint-disable camelcase, require-jsdoc */
const UsersDao = require('../dao/users-dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BaseError = require('../components/base-error');

/**
 * @class CommandHandler
 * @description service logic here
 */
class CommandHandler {
    constructor(pool, config) {
        this.usersDao = new UsersDao({pool}, this);
        this.config = config;
    }

    authenticate(token) {
        if (!token || !token.startsWith('Bearer ')) {
            throw new BaseError({
                code: 403,
                error: 'Need bearer token for authentication',
            });
        }
        return new Promise((resolve, reject) =>
            jwt.verify(token.slice(7), this.config.session.privateKey, (err, decoded) => {
                if (err) {
                    reject(new BaseError({code: 401, error: err.message}));
                }
                resolve({
                    success: true,
                    user: decoded,
                });
            })
        );
    }

    async login({login, password}) {
        const {usersDao} = this;
        const {session} = this.config;

        let user = await usersDao.getUserByLogin(login);
        if (!user || !user.length) {
            throw new BaseError({
                code: 400,
                error: 'User not found',
                formErrors: {
                    login: 'User not found',
                },
            });
        }
        [user] = user;

        if (!user.enabled) {
            throw new BaseError({
                code: 403,
                error: 'User disabled',
                formErrors: {
                    login: 'User disabled',
                },
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const formErrors = {};
            formErrors.password = 'Incorrect Password';
            throw new BaseError({code: 400, error: 'Wrong fields', formErrors});
        }

        const payload = {
            user_id: user.user_id,
            login: user.login,
            role: user.role,
        };

        return new Promise((resolve, reject) =>
            jwt.sign(payload, session.privateKey, {
                expiresIn: session.ttl,
            }, (err, token) => {
                if (err) {
                    log.error(err);
                    reject(new BaseError({error: err.message}));
                } else {
                    resolve({
                        success: true,
                        token: `Bearer ${token}`,
                    });
                }
            })
        );
    }
}

module.exports = CommandHandler;
