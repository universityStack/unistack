var express = require('express');
var CryptoJS = require("crypto-js");
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var cron = require('node-cron');
var url = require('url');
var db = require('../model/db');
var router = express.Router();


router.get('/accountVerify', function(req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var q = url.parse(fullUrl,true);
    var data = q.query;
    var id = data.id;
    var uid =decodeURIComponent(data.u);


    console.log(typeof uid);
    console.log(decodeURIComponent(uid));
    var bytes  = CryptoJS.AES.decrypt(uid, 'evren1numara');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log(plaintext);
    db.query("SELECT activation_status,activation_code FROM users WHERE id =?",[plaintext],function (err,result) {
        if (err){

            return res.send({code: 400, message:" db hatası bro"});
        }
        else if(result.length==0){
            res.end("<h1>HESAP BULUNAMADI...</h1>");
        }
        else {
            console.log(result);
            var activation_status =  result[0].activation_status;


            if (activation_status == 1){
                res.end("<h1>HESABINIZ SUANDA AKTiF HALDE...</h1>");
            }


            else {
                db.query("SELECT * FROM users WHERE activation_code=? and id=?",[id,plaintext],function (err,result) {
                    if (err){

                        return res.send({code: 400, message:" db hatası bro"});
                    }
                    else if(result.length==1)
                    {   var newactivation_code = randomstring.generate(15);
                        console.log(newactivation_code);
                        db.query("UPDATE users SET activation_status=?, activation_code=? WHERE id=?",[1,newactivation_code,plaintext],function (err,result) {
                            if (err){
                                return res.send({code: 400, message:"db sıçmış bro"});
                            }
                            else {
                                res.end("<h1>HESABiNiZ AKTiF EDiLDi...</h1>");
                            }
                        });



                    }
                    else
                    {
                        res.end("<h1>HESABINIZ AKTiF EDiLEMEDi...</h1>");
                    }
                })

            }



        }
    });






});

router.get('/accountVerifyAgain', function (req,res) {

    var email = req.query.email;
    console.log(email);
    idCrypo = function (id) {
        var ciphertext = CryptoJS.AES.encrypt(id, 'evren1numara');
        return ciphertext;
    };
    timer = function (id) {
        setTimeout(function () {
            db.query("UPDATE users SET spam=? WHERE id=?",[0,id],function (err,result) {
                if (err){
                    return res.send({code:400, message:"db hatasııı"});
                }
                else {
                    console.log("spam pasif");

                }
            });
        },300000);
    };
    db.query("SELECT * FROM users WHERE email=?",[email],function (err,result) {

        if (err){
            return res.send({code: 400, message:" db hatası bro"});
        }
        else if(result.length==0){
            return res.send({code: 400, message:"mail kayıtlı değil"});
        }
        else if(result.length==1){
            var spam = result[0].spam;
            if (spam==1){
                res.send({code: 400, message:"Mailiniz yollanmıştır...Mail gelmediyse 5 dakika sonra tekrar deneyin..."})
            }
            else {
                var activation_Code =  result[0].activation_code;
                var user_id= result[0].id;
                var link="http://"+req.get('host')+"/security/accountVerify?id="+activation_Code+"&u="+encodeURIComponent(idCrypo((user_id).toString()));
                var transporter = nodemailer.createTransport({
                    service: 'yandex',
                    host: 'smtp.yandex.com.tr',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'activate@unistackapp.com',
                        pass: '123654...'
                    }
                });
                var mailOptions = {
                    from: 'activate@unistackapp.com',
                    to: email,
                    subject: 'Please confirm your Email account',
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        return res.send({code: 400, error:"Mail gönderilirken bir hata oluştu..."});
                    }
                    else {
                        db.query("UPDATE users SET spam=? WHERE id=?",[1,user_id],function (err,result) {
                            if(err){
                                return res.send({code: 400, error:"dbb"});
                            }
                            else {
                                console.log("spam aktif");
                                timer(user_id);
                                return res.send({code: 200, message:"Mail başarılı bir şekilde gönderildi..."});
                            }
                        });

                    }
                });

            }

        }

    });

} );

router.get('/tokenControl', ensureToken, function(req, res){
    jwt.verify(req.token, 'tolunayguduk', function(err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                description: 'Protected information. Congrats!'
            });
        }
    });
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["oturum"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;
