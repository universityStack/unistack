var express = require('express');
var nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");
var passwordHash = require('password-hash');
var cron = require('node-cron');
var randomstring = require("randomstring");
var db = require('../model/db');
var router = express.Router();

router.post('/selectFaculty', function(req, res) {

    var uniCode = req.body.uniCode;

    db.query("SELECT * FROM faculty where uid =(select uid from university where uniCode = ?)",[uniCode], function (err, result, fields) {
        if (err){
            throw err;
            console.log("db hatası");
            res.send({code: 400, message:result});
        }
        else{
            res.send({code: 200, message:result});
        }
    });
});

router.post('/selectDepartment', function(req, res) {

    var uid = req.body.uid;
    var fid = req.body.fid;

    db.query("SELECT * FROM department where uid = ? and fid=?",[uid,fid], function (err, result, fields) {
        if (err){
            throw err;
            console.log("db hatası");
            res.send({code: 400, message:result});
        }
        else{
            res.send({code: 200, message:result});
        }
    });
});

module.exports = router;