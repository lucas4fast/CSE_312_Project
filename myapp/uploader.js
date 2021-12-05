const express = require('express');
const multer = require('multer');
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

router.post('/image-upload', imageUpload.single('image'), (req, res) => {
    console.log(myusers.addImage(req.body.username,req.body.image))
    res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router