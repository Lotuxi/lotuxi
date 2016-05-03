var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var BlogStore = require('./blogposts-mongod').BlogStore;


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));


if ('development' == app.get('env')) {
    app.set('mongodb_uri', 'mongo://localhost/dev');
}

if ('production' == app.get('env')) {
    app.set('mongodb_uri', 'mongo://localhost/prod');
}

app.configure('production', function(){
    app.use(express.errorHandler());
});

var blogStore = new BlogStore('localhost', 27017);

app.get('/', function(req, res) {
    blogStore.findAll( function(error, docs) {
        res.render('index.jade', {
            locals: {
                title: 'Blog',
                posts:docs
            }
        });
    })
});


app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.get('/blog/new', function(req, res){
    blogStore.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//app.use('/users', users);


app.get('/blog/:id', function(req, res) {
    blogStore.findById(req.params.id, function(error, post) {
        res.render('blog_new.jade',
        {locals: {
            title: post.title,
            post: post
        }
        });
    });
});

app.post('/blog/addcomment', function(req, res) {
    blogStore.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
        } , function(error, docs) {
            res.redirect('/blog/'+ req.param('_id'))
    });
});


// error handlers


// catch 404 and forward to error handler
app.get(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//app.listen(3000);

module.exports = app;
