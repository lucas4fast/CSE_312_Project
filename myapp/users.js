const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@postgres:5432/postgres");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Function to add image path to database
async function addImage(username,image_path) {
    try {
        console.log('Attempting to insert image path: '+image_path + ' for user: '+ username)
        path = "./media/" + image_path
        await db.none(`UPDATE "user" SET image_path = $1 WHERE username = $2`, [path, username]);
    } catch (err) {
        console.log(err);
    }
}

async function checkUser(username, password) {
    let user = await db.oneOrNone(`SELECT * FROM "user" where username = '${username}';`);
    console.log('User data: '+user)
    const match = await bcrypt.compare(password,user.password);
    console.log('Match: '+match)
    return match
}
async function addToken(username,token){
    let hashed = await bcrypt.hash(token,saltRounds)
    await db.none(`UPDATE "user" SET token = $1 WHERE username = $2`, [hashed, username]);
}

async function createUser(user,pass) {
    let hashPass = await bcrypt.hash(pass,saltRounds);
    console.log('Attempting to insert username: '+user + ' and password: '+ pass)
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
function generateToken(size) {

    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<size; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

module.exports = {
    addImage,
    checkUser,
    getUsers,
    createUser,
    addToken,
    generateToken,
}
