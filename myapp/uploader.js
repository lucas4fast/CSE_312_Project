const express = require('express');
const multer = require('multer');
var cookieParser = require('cookie-parser');
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@postgres:5432/postgres");
const bcrypt = require('bcrypt');
const myusers = require('./users.js')

const router = express.Router()

const imageStorage = multer.diskStorage({
    destination: './media/',  
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {  
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(undefined, true)
    }
})  

router.use(cookieParser());

router.post('/image-upload', imageUpload.single('image'), (req, res) => {

    const token = req.cookies['Authentication']
    db.any(`SELECT token,username from "user";`)
        .then(data => {
            data.map(u => {
                if (u.token != null && token != null) {
                    console.log(token, u.token)
                    bcrypt.compare(token, u.token).then((match) => {
                        if (match) {
                            console.log(u.username)
                            myusers.addImage(u.username, req.file.originalname)
                        }
                    })
                }
            })
        })

    res.redirect(301, "/feed")

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router