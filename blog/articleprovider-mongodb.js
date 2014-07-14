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
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ArticleProvider = function(host, port) {
    this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true, safe: false}));
    this.db.open(function(){});
};


ArticleProvider.prototype.getCollection= function(callback) {
    this.db.collection('articles', function(error, article_collection) {
        if( error ) callback(error);
        else callback(null, article_collection);
    });
};

ArticleProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback(error);
        else {
            article_collection.find().toArray(function(error, results) {
                if( error ) callback(error);
                else callback(null, results)
            });
        }
    });
};


ArticleProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback(error);
        else {
            article_collection.findOne({_id: new ObjectID(id)}, function(error, result) {
                if( error ) callback(error);
                else callback(null, result)
            });
        }
    });
};

ArticleProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback(error);
        else {
            if( typeof(articles.length)=="undefined")
                articles = [articles];

            for( var i =0;i< articles.length;i++ ) {
                article = articles[i];
                article.created_at = new Date();
                if( article.comments === undefined ) article.comments = [];
                for(var j =0;j< article.comments.length; j++) {
                    article.comments[j].created_at = new Date();
                }
            }

            article_collection.insert(articles, function(err, doc) {
                callback(null, articles);
            });
        }
    });
};

ArticleProvider.prototype.addCommentToArticle = function(articleId, comment, callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback( error );
        else {
            article_collection.update(
                {_id: new ObjectID(articleId)},
                {"$push": {comments: comment}},
                function(error, article){
                    if( error ) callback(error);
                    else callback(null, article)
                });
        }
    });
};

exports.ArticleProvider = ArticleProvider;