const path = require('path');
const Validator = require('../components/validator');
const validator = new Validator({coerceTypes: false, schemasPath: path.resolve(__dirname, '../schemas')});

describe('Validator tests', () => {
    it('wrong login schema', done => {
        try {
            validator.validate('user.login', {
                login1: 'name',
                password: '1234',
            });
            done('should be an error');
        } catch (err) {
            done();
        }
    });
    it('right login schema', done => {
        try {
            validator.validate('user.login', {
                login: 'name',
                password: '123456',
            });
            done();
        } catch (err) {
            done(err);
        }
    });
    it('wrong create user schema', done => {
        try {
            validator.validate('user.register', {
                login: 'test5',
                password: 1,
                enabled: false,
            });
            done(new Error('should be an error'));
        } catch (err) {
            done();
        }
    });
    it('right create user schema', done => {
        try {
            validator.validate('user.register', {
                login: 'test5',
                password: 'test123',
                enabled: false,
            });
            done();
        } catch (err) {
            done(err);
        }
    });
    it('wrong user.update schema', done => {
        try {
            validator.validate('user.update', {
                id: 124,
                login: 'test5',
                password: 1,
                enabled: false,
            });
            done(new Error('should be an error'));
        } catch (err) {
            done();
        }
    });
    it('right user.update schema', done => {
        try {
            validator.validate('user.update', {
                id: 124,
                password: 'test123',
                enabled: false,
            });
            done();
        } catch (err) {
            done(err);
        }
    });
});
