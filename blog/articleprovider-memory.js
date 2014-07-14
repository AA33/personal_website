/*
 * Copyright (c) 2014. Abhishek Anurag
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var articleCounter = 1;

ArticleProvider = function(){};
ArticleProvider.prototype.dummyData = [];

ArticleProvider.prototype.findAll = function(callback) {
    callback( null, this.dummyData )
};

ArticleProvider.prototype.findById = function(id, callback) {
    var result = null;
    for(var i =0;i<this.dummyData.length;i++) {
        if( this.dummyData[i]._id == id ) {
            result = this.dummyData[i];
            break;
        }
    }
    callback(null, result);
};

ArticleProvider.prototype.save = function(articles, callback) {
    var article = null;

    if( typeof(articles.length)=="undefined")
        articles = [articles];

    for( var i =0;i< articles.length;i++ ) {
        article = articles[i];
        article._id = articleCounter++;
        article.created_at = new Date();

        if( article.comments === undefined )
            article.comments = [];

        for(var j =0;j< article.comments.length; j++) {
            article.comments[j].created_at = new Date();
        }
        this.dummyData[this.dummyData.length]= article;
    }
    callback(null, articles);
};

/* Lets bootstrap with dummy data */
new ArticleProvider().save([
    {title: 'Post one', body: 'Body one', comments:[{author:'Bob', comment:'I love it'}, {author:'Dave', comment:'This is rubbish!'}]},
    {title: 'Post two', body: 'Body two'},
    {title: 'Post three', body: 'Body three'}
], function(error, articles){});

exports.ArticleProvider = ArticleProvider;