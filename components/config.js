const path = require('path');
const fs = require('fs');
const Validator = require('./validator');
const validator = new Validator({coerceTypes: false, schemasPath: path.resolve(__dirname, '../schemas')});
const log = require('winston');

let appConfig = {};

let appConfigFile = path.join(__dirname, '../config.json');
if (process.env.NODE_ENV) {
    appConfigFile = path.join(__dirname, `../config.${process.env.NODE_ENV}.json`);
}

if (!fs.existsSync(appConfigFile)) {
    throw new Error(`No config file found on path ${appConfigFile}`);
}

appConfig = require(appConfigFile);

validator.validate('config.base', appConfig);

for (const key in appConfig) {
    // eslint-disable-next-line no-prototype-builtins
    if (!appConfig.hasOwnProperty(key)) {
        continue;
    }

    if (typeof appConfig[key] === 'object') {
        appConfig[key] = Object.freeze(appConfig[key]);
    }
}
appConfig = Object.freeze(appConfig);
log.info('Config loaded');

module.exports = appConfig;
