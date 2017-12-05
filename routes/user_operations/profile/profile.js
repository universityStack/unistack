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
    sampleFile.mv(__dirname + '/../../../public/img/'+ req.body.user + Date.now() + '.jpg', function(err) {
        if (err)
            return res.status(500).send(err);
        res.send('Resim Yüklendi...!');
    });
});
router.post('/changeName', function (req, res) {
    name = req.body.name;
    surname = req.body.surname;
    userID = req.body.userID;

    if(name != "" && surname != ""){
        db.query("UPDATE users SET name = ?, surname = ? WHERE id= ?", [name, surname, userID], function (err,data) {
            if(err){
                res.send({code:400,error:"db hatası",error:err});
            }else{
                res.send({code:200, message:'kullanici adi degistirildi'});
            }
        })
    }
});



router.post('/deleteAccount', function (req, res) {
    req.body.userID;
});


module.exports = router;