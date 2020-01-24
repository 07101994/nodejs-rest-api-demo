var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var employeesRouter = require('./routes/employee');
const globalErrHandler = require('./controllers/errorController');
const appError = require('./utils/appError');
var mongooseLoader = require('./loaders/mongooseLoader');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/employees', employeesRouter);

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new appError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;
