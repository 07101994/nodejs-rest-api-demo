const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const port = 3001

const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express();
const mongooseLoader = require('./loaders/mongooseLoader');
const messageProcessorConsumer = require('./messageBroker/messageProcessorConsumer');
messageProcessorConsumer.start();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.get('/echo', (req, res) => res.json({'message':'This is an echo API'}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;