var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var api = require('./routes/api');
var config = require('./config.js');
var app = express();
var websocket = require('./web-socket')

var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db
}
const cors = require('cors');
app.use(cors(
   
));
app.use(myConnection(mysql, dbOptions, 'pool'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/socket.io')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/web-socket',websocket)
app.use('/api', api);


// localhost:3000/api


module.exports = app;
