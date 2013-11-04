
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
/*
app.get('/',  function(req, res){
    index.findAll(function(error, docs){
        res.render('index',{
          title: '',
          links:docs
        });
    })
});
*/
app.get('/', index.getHome);
app.get('/:page', index.findByName);
app.get('/backend/admin', function(req, res) { res.render('admin', { title: 'My Blog Backend' }) });
//Testing post feture
/*
app.post('/backend/admin/signin', function(req, res) {

    console.log(req.body.user + "<-Posted Data Test");

    res.send('200');

});
*/
app.post('/backend/admin/signin', admin.findByUser);
app.get('/backend/index', function(req, res){ res.send('200') });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});