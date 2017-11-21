var mysql = require('mysql');
var db_config = {
    host : '139.59.157.209',
    user : 'evren',
    password : 'Evren123...',
    database : 'deneme'
};
var connection;
connection = mysql.createConnection(db_config);
connection.connect(function (err) {
if (err){
console.log('Database connection error:',err);
}
else
console.log('... SQL CONNECTED ...');

});
module.exports = connection;
