var express = require('express');
var bodyParser = require("body-parser");
var user = require('./routes/user_operations/user');
var security = require('./routes/user_operations/security');
var global_variables = require('./global_variables');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/img',express.static(__dirname + '/public/img'));
app.use('/style',express.static(__dirname + '/public/style'));

//deneme

app.get('/',function (req,res) {
    res.end();
});
app.use('/user',user);
app.use('/security',security);
app.use(function (req,res) {
    return res.send({code: 400, message:"Sayfa mevcut değil"});
});



var server = app.listen(global_variables.server_port(),function () {
    console.log('... SERVER ON AIR ...');
});




