const log = require('winston');
const BaseError = require('../components/base-error');

const send = (err, req, res, next) => {
    if (err instanceof BaseError) {
        log.error(`Responded to request ${req.method}:${req.originalUrl} 
            ${JSON.stringify(req.body)}, with error`, err.error);
        return res.status(err.code || 500).send(err);
    } else if (!err.success && !err.searchSuccess) {
        log.error(`Responded to request ${req.method}:${req.originalUrl}  
            ${JSON.stringify(req.body)}, with error`, err.message);
        return res.status(500).send({error: err.message});
    }
    if (req.method !== 'get') {
        const resBody = JSON.stringify(err).slice(0, 200);
        log.info(`Responded to request ${req.method}: ${req.originalUrl} : `,
            `${resBody.length === 200 ? `${resBody}...` : resBody} : `);
    }
    res.status(200).send(err);
};

module.exports = send;
