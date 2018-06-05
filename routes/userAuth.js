module.exports = function(app,passport){
    //Register
    app.post('/register', passport.authenticate('local-signup',{
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true,

    }),
    function(req,res){
        console.log(req.user);
        res.redirect('/dashboard')
    });

    //Log in
    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    }));


}
