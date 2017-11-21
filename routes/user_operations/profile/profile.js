var express = require('express');
var path = require("path");
const fileUpload = require('express-fileupload');
var db = require('../../model/db');
var router = express.Router();

router.use(fileUpload());


router.post('/imageUpload', function (req,res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname + 'public/img/filename.jpg', function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});


module.exports = router;