const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@postgres:5432/postgres");
const bcrypt = require('bcrypt');
const saltRounds = 10;


function checkUser(username, password) {
    //... fetch user from a db etc.
    let match = checkHelper(username,password)
    console.log('VALUE RETURNED FROM HELPER: '+ match)
    return match
}
function checkHelper(username,password){
    var hashed = ''
    console.log(username +' with type of ' +typeof(username)+ ' '+ password + ' with type of '+ typeof(password))
    db.oneOrNone(`SELECT * FROM "user" where username = '${username}';`)
    .then(data => {
        console.log(data)
        console.log(data.password); // print new user id;
        hashed = data.password
        console.log('HASHED'+hashed)
        var match = bcrypt.compareSync(password, hashed);
        console.log('MATCH RESULT'+match) 
        return match   
    })
    .catch(error => {
        console.log('ERROR:', error); // print error;
    });
    
}
async function createUser(user,pass) {
    hashPass = bcrypt.hashSync(pass,saltRounds);
    console.log('Attempting to insert username: '+user + ' and password: '+ pass)
    console.log(typeof(hashPass))


    db.one(`INSERT INTO "user"(username,password,online) VALUES('${user}','${hashPass}',false) RETURNING id;`)
    .then(data => {
        console.log(data.id); // print new user id;
    })
    .catch(error => {
        console.log('ERROR:', error); // print error;
    });
}
const getUsers = (req,res) => {
    console.log('ATTEMPTING TO GET ALL USERS')
    db.any(`SELECT * FROM "user";`,(error,results) =>{
        if (error) {
            throw error
        }
        console.log(results)
        res.status(200).json(results.rows)
    })
}
async function getUserById(user_id) {
    const user_found = db.oneOrNone(`select * from "user" where id = '${user_id}';`)
    return user_found
}

module.exports = {
    checkUser,
    getUsers,
    getUserById,
    createUser,
}
