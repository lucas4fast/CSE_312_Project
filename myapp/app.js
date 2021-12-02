var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@postgres:5432/postgres");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = 6006;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"/pageDesigns/index.html"))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,"/pageDesigns/login.html"))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname,"/pageDesigns/register.html"))
})

app.get('/feed', (req, res) => {
  res.sendFile(path.join(__dirname,"pageDesigns/feed.html"))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname,"/pageDesigns/notfoundNoAuth.html"))
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${8000}`)
})

module.exports = app;
