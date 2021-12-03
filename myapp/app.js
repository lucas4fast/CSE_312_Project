var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const myusers = require('./users.js')

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
app.post('/login', urlencodedParser,  (req, res,next) => {
  var isUser = myusers.checkUser(req.body.username,req.body.password);
  //console.log('isUser value'+isUser)
  if(isUser==true) {
    res.redirect(301,'/')
  }
  else{
    res.sendFile(path.join(__dirname),"/pageDesigns/notfoundNoAuth.html")
  }

})
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname,"/pageDesigns/register.html"))
})
app.post('/register', urlencodedParser,  (req, res,next) => {
  console.log(myusers.createUser(req.body.username,req.body.password))
  res.redirect(301,"/login")
})

app.get('/feed', (req, res) => {
  res.sendFile(path.join(__dirname,"pageDesigns/feed.html"))
})

app.get('/users/', myusers.getUsers)
app.get('/users/:id', myusers.getUserById)
app.post('/users', myusers.createUser)
//app.put('/users/:id', myusers.updateUser)
//app.delete('/users/:id', myusers.deleteUser)

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
