var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@postgres:5432/postgres");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const myusers = require('./users.js')
const uploadRouter = require('./uploader.js');

var app = express();
const port = 6006;



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(uploadRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"/pageDesigns/index.html"))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,"/pageDesigns/login.html"))
})
app.post('/login', urlencodedParser,  async(req, res) => {
  let isUser = await myusers.checkUser(req.body.username,req.body.password)
  console.log('isUser: '+isUser)
  if(isUser) {
    const token =myusers.generateToken(30)
    myusers.addToken(req.body.username,token)
    res.cookie('Authentication', token) //Sets Authentication = token
    res.redirect(301,'/feed')
  }
  else{
    res.sendFile(path.join(__dirname),"/pageDesigns/notfoundNoAuth.html")
  }
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname,"/pageDesigns/register.html"))
})
app.post('/register', urlencodedParser,  async(req, res,next) => {
  const allowed = await myusers.checkPass(req.body.password)
  console.log('VALUE RETURNED',allowed)
  if(allowed){
    console.log(myusers.createUser(req.body.username,req.body.password))
    res.redirect(301,"/login")
  }
  else{
    res.send('INVALID PASSWORD')
  }
  
})

app.get('/feed', (req, res) => {
  res.sendFile(path.join(__dirname,"pageDesigns/feed.html"))
})

// Image upload page
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname,"/pageDesigns/imageUpload.html"))
})

app.get('/users/', (req,res)=> {
  
  try {
    db.any(`SELECT username,id,token,online,image_path from "user";`)
    .then(data => {
      console.log(data)
      res.send(data)
    })
  }
  catch (error) {
    res.send('ERROR',error)
  }
})
app.get('/users/:id', (req,res) => {
  db.oneOrNone(`select username from "user" where id = '${req.params.id}';`)
    .then(data => {
        console.log(data.username); // print new user id;
        res.send(data.username)
    })
    .catch(error => {
        console.log('ERROR:', error); // print error;
        res.send('NOT FOUND')
    });
})
app.get('/online/', (req,res)=>{
  var users = []
  try {
    db.any(`SELECT online,token,username from "user";`)
    .then(data => {
      data.map(u =>{
        if(u.token != null && u.online != false){
          console.log(u.username)
          users.push(u.username)
        }
      })
      //console.log(data)
      res.send(users)
    })
  }
  catch (error) {
    res.send('ERROR',error)
  }
  
})
app.post('/online',(req,res)=>{
  try {
    const username = req.body.username
    console.log(username)
    db.none(`UPDATE "user" SET online = $1 where username = $2`, [false, username]);
    res.send('USER SETTING UPDATED')
  }
  catch (error)  {
    console.log(error)
    res.send('NOT FOUND')
  }
})
app.post('/logout', (req,res)=>{
  try {
    const username = req.body.username
    console.log(username)
    db.none(`UPDATE "user" SET token = $1 where username = $2`, [null, username]);
    res.send('TOKEN DESTROYED')
  }
  catch (error)  {
    console.log(error)
    res.send('NOT FOUND')
  }
})

app.get('/token/', (req,res)=>{
  try {
    const token = req.cookies['Authentication'];
    ret = 'NOT FOUND'
    db.any(`SELECT token,username from "user";`)
      .then(data => {
          data.map(u =>{
              if(u.token != null && token != null){
                console.log(token,u.token)
                  bcrypt.compare(token,u.token).then((match)=>{
                      if(match){
                          ret = u.username
                          res.send(ret)
                      }
                  })
              }
          })
          if(token == null){
            res.send('NOT FOUND')
          }
    })
  }
  catch (error)  {
    console.log(error)
    res.send('NOT FOUND')
  }

})
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
