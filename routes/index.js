var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('blog', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'blog' database using 'pages' collection");
        db.collection('pages', {safe:true}, function(err, collection) {
            populateDB();
            if (err) {
                console.log("The 'pages' collection doesn't exist.");
                populateDB();
            }
        });
    }
});

exports.getCollection= function(callback) {
    db.collection('pages', function(error, collection) {
        if( error ) callback(error);
        else callback(null, collection);
    });
};


exports.findAll = function(callback) {

    this.getCollection(function(error, collection){
        if( error ) callback(error)
        else
            collection.find().toArray(function(error, results){
                if( error ) callback(error)
                else callback(null, results)
            });
    });
};


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving pages: ' + id);
    db.collection('pages', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByName = function(req, res){
    var page = req.params.page;
    console.log('Retrieving page: ' + page);
    db.collection('pages', function(err, collection) {

        var link = '';
        collection.find().toArray(function (error, results) {
            if (error) {
                console.log(error)
            } else {
                link = results;
            }
        })

        collection.findOne({'page_slug':page},function(err, items){
            var createddate =  new Date(items.page_created_at);
            res.render('pages',{
                title: items.page_title,
                page_content: items.page_body,
                date: createddate.toDateString(),
                links: link
            });
        });
    });
};

exports.getHome = function(req, res){
    var page = 'home';
    console.log('Retrieving page: ' + page);
    db.collection('pages', function(err, collection) {

        var link = '';
        collection.find().toArray(function (error, results) {
            if (error) {
                console.log(error)
            } else {
                link = results;
            }
        })

        collection.findOne({'page_slug':page},function(err, items){
            var createddate =  new Date(items.page_created_at);
            res.render('index',{
                title: items.page_title,
                body: items.page_body,
                date: createddate.toDateString(),
                links: link
            });
        });
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var wines = [
        {
            page_title: 'Welcome',
            page_body: 'this is the test <b>home</b> page',
            page_comments: [{
                person: '',
                comment: '',
                created_at: ''
            }],
            page_created_at: new Date(),
            page_slug: 'home'
        },
        {
            page_title: 'About',
            page_body: 'this is the test about page',
            page_comments: [{
                person: '',
                comment: '',
                created_at: ''
            }],
            page_created_at: new Date(),
            page_slug: 'about'
        },
        {
            page_title: 'Blog',
            page_body: 'this is the test blog page',
            page_comments: [{
                person: '',
                comment: '',
                created_at: ''
            }],
            page_created_at: new Date(),
            page_slug: 'blog'
        }];

    db.collection('pages', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {});
    });

};