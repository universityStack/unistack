var express = require('express');
var db = require('./model/db');
var router = express.Router();

router.get('/',function (req,res) {
    db.query("insert into registeredDevice(registerID) values(?)",[req.header("registerID")],function (err,result) {
        if(err){
            res.send(err);
        }
        else{
            res.send({code : 200 , message : "kayıt başarılı"});
        }
    });
});

module.exports = router;