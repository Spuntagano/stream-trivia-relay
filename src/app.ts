var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var allowCors = require('./middlewares/allow-cors');
var errorHandler = require('./middlewares/error-handler');
var indexRouter = require('./routes/index');

var joinRouter = require('./routes/join');
var answerRouter = require('./routes/answer');
var stateRouter = require('./routes/state');
var usersRouter = require('./routes/users');

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCors);

app.use('/', indexRouter);
app.use('/join', joinRouter);
app.use('/answer', answerRouter);
app.use('/state', stateRouter);
app.use('/users', usersRouter);

app.use(errorHandler);

module.exports = app;
