var blogCounter = 1;

BlogStore = function(){};
BlogStore.prototype.testData = [];

BlogStore.prototype.findAll = function(callback) {
    callback( null, this.testData )
};

BlogStore.prototype.findById = function(id, callback) {
    var result = null;
    for(var i =0;i<this.testData.length;i++) {
        if( this.testData[i]._id == id ) {
            result = this.testData[i];
            break;
        }
    }
    callback(null, result);
};

BlogStore.prototype.save = function(posts, callback) {
    var post = null;

    if( typeof(posts.length)=="undefined")
        posts = [posts];

    for( var i =0;i< articles.length;i++ ) {
        post = posts[i];
        post._id = blogCounter++;
        post.created_at = new Date();

        if( post.comments === undefined )
            post.comments = [];

        for(var j =0;j< post.comments.length; j++) {
            post.comments[j].created_at = new Date();
        }
        this.testData[this.testData.length]= post;
    }
    callback(null, posts);
};

/* Lets bootstrap with dummy data */
new BlogStore().save([
    {title: 'Post one', body: 'Body one', comments:[{author:'Bob', comment:'I love it'}, {author:'Dave', comment:'This is rubbish!'}]},
    {title: 'Post two', body: 'Body two'},
    {title: 'Post three', body: 'Body three'}
], function(error, posts){});

exports.BlogStore = BlogStore;