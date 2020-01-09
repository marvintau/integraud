var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// In development mode, webpack-dev server takes care of static assets. 
// So we don't need to specify the public path. However, In production
// environment, all static assets are put in <dir>/client/build.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "client/build")));
}

app.use('/api/project', require('./api/project'));
app.use('/api/user', require('./api/user'));
app.use('/api/confirmation', require('./api/confirmation'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// extracted from normalized port
var namedPort = process.env.PORT || '3001';
port = parseInt(namedPort, 10);
port = isNaN(port) ? namedPort : port >= 0 ? port : false;
app.set('port', port);

module.exports = app;
