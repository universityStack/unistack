var express = require('express');
var db = require('../model/db');
var router = express.Router();


router.get('/',function (req,res) {
    rift = req.headers.rift;
    altLimit= (rift-1)*50;
    ustLimit = rift*50;
    db.query('select * from chat limit '+altLimit+','+ustLimit, function (err,data) {
        if(err){
            res.send({code:400,message:"db hatası"});
            console.log(err);
        }
        else{
            res.send(data);
        }
    });
});


module.exports = router;