var Article = require('../models/Article.js');
var Note = require('../models/Note.js');
var User = require('../models/User.js');
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var axios = require("axios");

var exports = module.exports = {};

    exports.findNew = function(req,res){
        var uri = req.body.link;
        request(uri, function(error, response, html){

            var $ = cheerio.load(html);

            var results = {
                list: []
            };

            $("p.title").each(function(i, element){
                console.log(element);
                var title = $(element).text();

                var link = $(element).children().attr("href");


                results.list.push({
                    title: title,
                    link: link
                });
            });

            console.log(results);
            
            res.json(results)
        });

        
    };

    exports.save = function(req,res){
        Article.create(req.body)
            .then(function(dbArticle){

                return User.findOneAndUpdate({_id : req.params.userId}, {$push: {articles: dbArticle._id} }, { new: true});
            })
            .then(function(dbUser){
                res.json(dbUser);
            })
            .catch(function(err){
                res.json(err);
            })

        
    };

    exports.delete = function(req,res){

    };
    exports.viewArticleNote = function(req,res){

        Article.findOne({_id: req.params.articleId})
            .populate('notes')
            .then(function(dbArticle){
                res.json(dbArticle);
            })
            .catch(function(err){
                res.json(err);
            });
    }
    exports.addNote = function(req,res){
        Note.create(req.body)
            .then(function(dbNote){

                return Article.findByIdAndUpdate({_id : req.params.articleId}, {$push: {notes: dbNote._id} }, {new:true});
            })
            .then(function(dbArticle){
                res.json(dbArticle);
            })
            .catch(function(err){
                res.json(err);
            });
    };

    exports.updateNote = function(req,res){
        
    };

    exports.viewSaved = function(user,cb){
        console.log("Here");
        User.find({_id : user._id})
        .populate({
            path: 'articles',
            populate: {
                path: 'notes',
                model : 'Note'
        }})
        .then(function(dbUser){
            cb(dbUser);

        })
        .catch(function(err){
            cb(err);
        });
    };

    function getPost(link, cb){
        
    }