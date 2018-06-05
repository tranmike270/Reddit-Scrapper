var display = require('../controllers/views.js');
module.exports = function(app){
    
    app.get('/', display.home);

    app.get('/home/:userId?', isLoggedIn, display.home);

    app.get('/dashboard/:userId?', isLoggedIn, display.dashboard);

    app.get('/search/:userId?', isLoggedIn, display.search);

    app.get('/logout', display.logout);
    
    function isLoggedIn(req, res, next) {
 
        if (req.isAuthenticated())
    
            return next();
        //Redirects home with a loginMessage flash message
        req.flash('logInMessage',"Please Log in to access that option");
    
        res.redirect('/');
    
    }


};