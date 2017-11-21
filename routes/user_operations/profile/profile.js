var express = require('express');
var path = require("path");
const fileUpload = require('express-fileupload');
var db = require('../../model/db');
var router = express.Router();

router.use(fileUpload());


router.post('/imageUpload', function (req,res) {
    if (!req.files)
        return res.status(400).send('Hiçbir Dosya Yüklenmedi...');
    var sampleFile = req.files.sampleFile;
    sampleFile.mv(__dirname + '/../../../public/img/filename.jpg', function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('Resim Yüklendi...!');
    });
});


module.exports = router;