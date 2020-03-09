const pg = require('pg');
const http = require('http');
const express = require('express');
const log = require('./components/logger');

// middleware
const bodyParser = require('body-parser');
const send = require('./middleware/send');
const auth = require('./middleware/auth');

// services
const {storage, api, session} = require('./config');
const CommandHandler = require('./services');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

// init services
const pool = new pg.Pool(storage);
const commandHandler = new CommandHandler(pool, {storage, session});
const authEndpoints = authRoutes(commandHandler);
const usersEndpoints = usersRoutes(commandHandler);
const app = express();

// init server
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(auth(commandHandler));
app.use('/', authEndpoints);
app.use('/', usersEndpoints);
app.use(send);

// run server
const server = http.createServer(app);
server.listen(api.port);
log.info(`Server started at port: ${api.port}`);
