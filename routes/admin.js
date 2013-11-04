var mongo = require('mongodb');
var crypto = require('crypto');
var md5hash = crypto.createHash('md5');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('blog', server, {safe: true});



db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'blog' database using 'users' collection");
        db.collection('users', {safe:true}, function(err, collection) {
            //populateDB();
            if (err) {
                console.log("The 'users' collection doesn't exist.");
                populateDB();
            }
        });
    }
});

exports.findByUser = function(req, res){
    var user = req.body.user;
    var pass = crypto.createHash('md5').update(req.body.passwd).digest("hex");
    console.log('Retrieving user: ' + user + ' Pass:' + pass);
    db.collection('users', function(err, collection) {
        collection.findOne({'user':user},function(err, items){
            if(items.passwd == pass) {
                res.redirect('/backend/index')
            }
        });
    });
};

var populateDB = function() {

    var add_users = [
        {
            user: 'imoore',
            passwd: crypto.createHash('md5').update('test1').digest("hex")
        },
        {
            user: 'admin',
            passwd: crypto.createHash('md5').update('test1').digest("hex")
        }];

    db.collection('users', function(err, collection) {
        collection.insert(add_users, {safe:true}, function(err, result) {});
    });
};