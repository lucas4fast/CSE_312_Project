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

app.get('/feed', async(req,res)=> {

  const token = req.cookies['Authentication'];
  if(token == null){
    res.sendFile(path.join(__dirname),"/pageDesigns/notfoundNoAuth.html")
  }
  else{
    //set the appropriate HTTP header
  res.setHeader('Content-Type', 'text/html');
  //res.write
  //send multiple responses to the client



  try {
    res.write(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>body { margin: 0; font-family: Arial, Helvetica, sans-serif;}.topnav { overflow: hidden; background-color: black;}.topnav b { float: left; color: #f2f2f2; text-align: center; padding: .5%; text-decoration: none; font-size: 180%;}.topnav a { float: right; color: #f2f2f2; text-align: center; padding: .8%; text-decoration: none; font-size: 110%;}.topnav a:hover { background-color: #ddd; color: black;}.topnav a.active { background-color: #04AA6D; color: white;}.card { box-shadow: 0 .5% 1% 0 rgba(0,0,0,0.2); transition: 0.3s; border-radius: 2%; padding: 1%; background-color: gray; margin-top: 1.5%;}img { border-radius: 2%;}</style></head><body><div class="topnav"> <b href="#home">Minima</b> <a href="#profile">Profile</a> <a href="/upload">Update Profile Pic</a></div><div id='feed' style="margin-top: 5%; width: 70%; top: 10%; margin-left: 15%; height: 100%;"></div> <form action="/logout" method="post"> <input id="username" type="text" name="username" placeholder="*Username"> <input type="submit" value="Logout"> </form> <form action="/online" method="post"> <input id="username2" type="text" name="username" placeholder="*Username"> <input type="submit" value="Toggle Offline Setting"> </form></body></html>`)
    
    db.any(`SELECT online,token,username from "user";`)
    .then(data => {
      data.map(u =>{
        if(u.token != null && u.online != false){
          console.log(u.username)
          res.write('<h1>User: '+u.username+'<img src="'+u.image_path+'" alt="Profile Pic Absent"></h1>')
        }
      })
      //console.log(data)
      res.end();
    })
  }
  catch (error) {
    res.send('ERROR',error)
  }
  //end the response process
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

app.post('/online',async(req,res)=>{
  try {
    const username = req.body.username
    console.log(username)
    let curr = await db.oneOrNone(`SELECT online from "user" where username = '${username}';`)
    console.log('CURR:',curr.online)
    if(curr.online){
      console.log('IN TRUE CASE:')
      db.none(`UPDATE "user" SET online = $1 where username = $2`, [false, username]);
    }
    else{
      console.log('IN FALSE CASE:')
      db.none(`UPDATE "user" SET online = $1 where username = $2`, [true, username]);
    }
    
    //db.none(`UPDATE "user" SET online = $1 where username = $2`, [false, username]);
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
