var express = require('express');
var nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");
var passwordHash = require('password-hash');
var cron = require('node-cron');
var randomstring = require("randomstring");
var db = require('../model/db');
var router = express.Router();

router.post('/selectUnit', function(req, res) {

    var uniCode = req.body.uniCode;

    db.query("SELECT * FROM units where uid =(select uid from university where uniCode = ?)",[uniCode], function (err, result, fields) {
        if (err){
            throw err;
            console.log("db hatası");
            res.send({code: 400, message:result});
        }
        else{
            res.send({code: 200, message:result});
            console.log(result);
        }
    });
});

router.post('/selectFaculty', function(req, res) {

    var uniCode = req.body.uniCode;
    var unitID = req.body.unitID;

    db.query("SELECT * FROM faculty where uid =(select uid from university where uniCode = ?) and unitID=?",[uniCode,unitID], function (err, result, fields) {
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

    var uniCode = req.body.uniCode;
    var unitID = req.body.unitID;
    var facID = req.body.facID;


    db.query("SELECT * FROM department where uid =(select uid from university where uniCode = ?) and unitID=? and facID=?  ",[uniCode,unitID,facID], function (err, result, fields) {
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

router.post('/submit', function (req,res) {
    var userID = req.body.userID;
    var uniCode = req.body.uniCode;
    var unitID = req.body.unitID;
    var facID = req.body.facID;
    var depID = req.body.depID;
    var sinif = req.body.sinif;
    db.query("select uid from university where uniCode=?",[uniCode],function (err,data) {
        if(err){
            res.send({code: 400, message:err});
        }
        else {
            console.log(data[0].uid);
            db.query("INSERT INTO universityinfo (userID, uniID, facID, depID, sinif) VALUES (?,?,?,?,?)",[userID,data[0].uid,facID,depID,sinif], function (err, result) {
                if (err){
                res.send({code: 400, message:err});                }

                else {
                    res.send({code: 200, message:"kayıt başarılı"});
                }
            });
        }
    });



});


module.exports = router;