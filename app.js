/**
 * Module dependencies.
 */
var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    index = require('./routes/index'),
    admin = require('./routes/admin'),
    routes = require('./routes');

var app = express();

// all environments

app.set('port', process.env.PORT || 30000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index.getHome);
app.get('/:page', index.findByName);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
