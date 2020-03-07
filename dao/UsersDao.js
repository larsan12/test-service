/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase, require-jsdoc */
const IDao = require('./IDao.js');
const bcrypt = require('bcryptjs');
const BaseError = require('../components/base-error');

/**
 * @class
 * @extends {IDao}
 */
class UsersDao extends IDao {
    constructor(...args) {
        super(...args);
        this.saltRounds = 10;
        this.fields = [
            'id',
            'login',
            'password',
            'enabled',
        ];
    }

    async createUser(data) {
        const user = await this.getUserByLogin(data.login);
        if (user && user.length) {
            throw new BaseError({
                error: 'Login already exist',
                formErrors: {
                    login: 'Login already exist',
                },
            });
        }

        const newUser = {
            login: data.login,
            enabled: data.enabled,
        };

        newUser.password = await bcrypt.hash(data.password, this.saltRounds);
        const [{id}] = await this.users()
            .insert(newUser)
            .returning('id')
            .pool();
        return {
            success: true,
            data: {
                id,
                login: data.login,
                enabled: data.enabled,
            },
        };
    }

    getUserByLogin(login) {
        return this.users()
            .select(...this.fields)
            .where({login})
            .limit(1)
            .pool();
    }

    async updateUser(data) {
        const updatedFields = {};
        if (data.hasOwnProperty('enabled')) {
            updatedFields.enabled = data.enabled;
        }
        if (data.password) {
            updatedFields.password = await bcrypt.hash(data.password, this.saltRounds);
        }
        await this
            .users()
            .where('id', data.id)
            .update(updatedFields)
            .pool();
        return {
            success: true,
        };
    }

    async getUsers(params) {
        if (!params.sortName || params.sortName === 'null') {
            params.sortName = 'id';
            params.sortOrder = 'desc';
        }

        const fields = {
            id: 'id',
            login: 'login',
            enabled: 'enabled',
        };

        const query = this
            .users()
            .select(fields)
            .parseParams(params, fields);

        const data = await query.pool();
        const totalSize = (await this
            .users()
            .count('*')
            .pool())[0].count;

        return {
            searchSuccess: true,
            dataTotalSize: totalSize,
            data,
        };
    }
}

module.exports = UsersDao;
