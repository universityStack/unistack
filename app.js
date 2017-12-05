var express = require('express');
var bodyParser = require("body-parser");
var path = require("path");
var db = require('./routes/model/db');
var user = require('./routes/user_operations/user');
var chatOldMessage = require('./routes/user_operations/chatOldMessage');
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
app.use('/chatOldMessage',chatOldMessage);
app.get('/chat',function (req,res) {
    res.sendFile(__dirname + '/public/chat.html');
});
app.get('/upload',function (req,res) {
    res.sendFile(__dirname + '/public/upload.html');
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

    socket.on('user',function (user) {
        socket.username = user;
        console.log(socket.username + ' connected to : ' + socket.channel);
    });
    socket.on("channelfixer", function (mychannel) {
       socket.join(mychannel);
        socket.channel = mychannel;
    });
    socket.on('disconnect', function(){
        console.log(socket.username + ' disconnected from : ' + socket.channel);
        socket.leave(socket.channel);

    });







    socket.on('switchRoom', function(newroom){
        socket.leave(socket.channel);
        socket.join(newroom);
        socket.channel = newroom;
    });










    socket.on("message", function (msg) {
        db.query('INSERT INTO chat(message,gonderen,gonderilen,tarih) values(?,?,?,now())',[msg, socket.username, socket.channel],function (err,data) {
            if(err){
                console.log(err);
            }
            else{
                var veri = {
                    'mesaj' : msg,
                    'user' : socket.username,
                    "kanal" : socket.channel,
                    "tarih" : new Date().getHours()+":"+ new Date().getMinutes() + "/" + new Date().getDay() + "." + new Date().getMonth() + "." + new Date().getFullYear()
                //surum
                }
                socket.to(socket.rooms[socket.channel]).emit('message', veri);
            }
        });
    });
    socket.on('typing', function (status) {
        socket.to(socket.rooms[socket.channel]).emit('typing', status);
    });
    socket.on('stoptyping', function (status) {
        socket.to(socket.rooms[socket.channel]).emit('stoptyping', status);
    });


});