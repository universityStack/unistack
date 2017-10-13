var express = require('express');
var bodyParser = require("body-parser");
var path = require("path");
var user = require('./routes/user_operations/user');
var security = require('./routes/user_operations/security');
var universityInfo = require('./routes/user_operations/universityInfo');
var global_variables = require('./global_variables');
//*************************************************************************
var app = express();
//*************************************************************************
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/img',express.static(__dirname + '/public/img'));
app.use('/style',express.static(__dirname + '/public/style'));
//**************************************************************************
app.get('/',function (req,res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use('/user',user);
app.use('/security',security);
app.use('/universityInfo',universityInfo);
app.get('/chat',function (req,res) {
    res.sendFile(__dirname + '/public/chat.html');
});
app.use(function (req,res) {
    return res.send({code: 400, message:"Sayfa mevcut değil"});
});
//*************************************************************************
var server = app.listen(global_variables.server_port(),function () {
    console.log('... SERVER ON AIR ...');
});
//*************************************************************************


var io = require("socket.io").listen(server);
io.sockets.on("connection", function (socket) {
    var kanal;
    var kullanici;


    socket.on('user',function (user) {
        kullanici = user;
        console.log(kullanici + ' connected to : ' + kanal);
    });
    socket.on("channelfixer", function (mychannel) {
       socket.join(mychannel);
        kanal = mychannel;
    });
    socket.on('disconnect', function(){
        console.log(kullanici + ' disconnected from : ' + kanal);
    });
    socket.on("message", function (msg) {
        socket.to(socket.rooms[kanal]).emit('message', msg);
    });

});