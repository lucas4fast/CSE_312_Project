const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@postgres:5432/postgres");
const bcrypt = require('bcrypt');
const saltRounds = 10;


async function checkUser(username, password) {
    //... fetch user from a db etc.
    const hashed = db.oneOrNone(`SELECT password FROM user where username = '${username}';`)
    const match = bcrypt.compareSync(password, hashed);
    return match
}

async function createUser(user,pass) {
    hashPass = bcrypt.hashSync(pass,saltRounds)
    console.log('Attempting to insert username: '+user + ' and password: '+ pass)
    const new_user = db.any(`INSERT INTO user ("username", "password") VALUES ('${user}', '${hashPass}')`)
    return new_user
}
async function getUsers() {
    const list_users = db.any(`SELECT * FROM user;`)
    return list_users
}
async function getUserById(user_id) {
    const user_found = db.oneOrNone(`select * from user where id = '${user_id}';`)
    return user_found
}

module.exports = {
    checkUser,
    getUsers,
    getUserById,
    createUser,
}
