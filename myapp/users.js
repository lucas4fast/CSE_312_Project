const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@postgres:5432/postgres");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Function to add image path to database
async function addImage(username,image_path) {
    try {
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
    addImage,
    checkUser,
    getUsers,
    getUserById,
    createUser,
}
