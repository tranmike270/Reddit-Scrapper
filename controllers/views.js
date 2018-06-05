var viewBuilder = {};
var articles = require('./articles.js');
var exports = module.exports = {};

    exports.home = function(req,res){
        console.log("Going Home");
        viewBuilder.SignUpError = req.flash("signUpMessage");
        viewBuilder.LogInError = req.flash("logInMessage");
        if(req.user){
            console.log("he still here");
            viewBuilder.LoggedIn = true;
        }
        res.render('home', viewBuilder);
    };

    exports.dashboard = function(req,res){
        console.log('dash');
        viewBuilder.LoggedIn = true;
        viewBuilder.firstName = req.user.firstName;
        viewBuilder.lastName = req.user.lastName;
        viewBuilder.userId = req.user._id;
        viewBuilder.links = {
            home : '/home/?' + req.user._id,
            dashboard: '/dashboard/?' + req.user._id,
            search: '/search/?' + req.user._id,
            contact: '/contact/?' + req.user._id
        }

        if(viewBuilder.SignUpError){
            delete viewBuilder.SignUpError;
        };

        if(viewBuilder.LogInError){
            delete viewBuilder.LogInError;
        };

        articles.viewSaved(req.user, function(results){
            console.log(results[0]);
            console.log(results[0].articles[0]);
            viewBuilder.usersArticles = results[0].articles;
            
            res.render('dashboard', viewBuilder);
        })
        

    };

    exports.search = function(req,res){

        res.render('search', viewBuilder);
    };

    exports.logout = function(req,res){

        req.session.destroy(function(err) {
            req.user = {};
            viewBuilder.LoggedIn = false;
            console.log(req.user);
            res.redirect('/');
     
        });
    }