var articles = require('../controllers/articles.js');

// Parses our HTML and helps us find elements
var cheerio = require('cheerio');
// Makes HTTP request for HTML page
var axios = require("axios");

var Promises = require('bluebird');
module.exports = function(app){

    app.get('/saved/:id', articles.viewSaved);

    // app.post('/newArticles', articles.findNew);

    app.get("/newArticles/:subreddit", function(req,res){
       
        var uri = "https://www.reddit.com/r/" + req.params.subreddit;
        console.log(uri)
        axios.get("https://www.reddit.com/r/" + req.params.subreddit + "/").then(function(response){
            var $ = cheerio.load(response.data);
            var results = [];
            // $("a.SQnoC3ObvgnGjWt90zD9Z").each(function(i, element){
            //     if(i === 0){
            //         console.log($(this).parent().parent().parent().children());
            //     }
            //     var title = $(this).children('h2').text();
            //     var link = $(this).attr("href");
            //     results.push({
            //         title: title,
            //         link: link
            //     });

            // })

            
            // console.log(results);
            // var resJSON = function(results){
            //     if(results.length === 0){

            //     }
            // }
            // res.send(results);
         
            Promises.each($("a.SQnoC3ObvgnGjWt90zD9Z").get(), function(element){
                console.log($(element).parent().parent().parent().closest('.jGdRvH').children());
                var title = $(element).children('h2').text();
                var link = $(element).attr('href');
                results.push({
                    title: title,
                    link: link
                });
                
            }).then(function(){

                console.log(results)
                res.json(results);
            })

        });
        
    })
    app.post('/save/:userId', articles.save);

    app.get('/note/:articleId', articles.viewArticleNote);
    
    app.post('/newNote/:articleId', articles.addNote);

    app.put('/updateNote/:noteId', articles.updateNote);

    app.delete('/delete', articles.delete);
    
};


function findPost(cb){
    var results = [];
    $("a.SQnoC3ObvgnGjWt90zD9Z").each(function(i, element){
        console.log(i);
        if(i === 0){
            console.log($(this).parent().parent().parent().children('.mvqfhh-0 dzqnSq'));
        }
        var title = $(this).children('h2').text();
        var link = $(this).attr("href");
        console.log(title);
        console.log(link);
        results.push({
            title: title,
            link: link
        });

        console.log(i + ": " + results);
    })
}