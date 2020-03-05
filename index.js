const pg = require('pg');
const http = require('http');
const express = require('express');
const log = require('./components/logger');

// middleware
const bodyParser = require('body-parser');
const validateBody = require('./routes/middleware/validate-body');
const send = require('./routes/middleware/send');
const auth = require('./routes/middleware/auth');

// services
const {storage, api, session} = require('./components/config');
const CommandHandler = require('./services');
const reportsRoutes = require('./routes/reports');

// init services
const pool = new pg.Pool(storage);
const commandHandler = new CommandHandler(pool, {session});
const reportsEndpoints = reportsRoutes(commandHandler);
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(auth(commandHandler));
app.use(validateBody);
app.use('/report', reportsEndpoints);
app.use(send);

// run server
const server = http.createServer(app);
server.listen(api.port);
log.info(`Server started at port: ${api.port}`);
