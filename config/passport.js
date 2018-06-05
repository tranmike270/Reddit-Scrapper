// Requiring module to encrypt passwords
var bCrypt = require('bcrypt-nodejs');

// Exporting password
module.exports = function(passport, user){
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
    
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        User.findOne({_id:id}).then(function(user){
            
            if(user){
                done(null, user);
            }else {
                done(user.error, null);
            };
        });
    });

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        }, 
        function(req, username, password, done){
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
             
            };

            User.findOne({username: username}).then(function(user){
                if(user){
                    return done(null,false, req.flash("signUpMessage","Username is in use"));
                } else {

                    var userPassword = generateHash(password);

                    var newUserData = {
                        username: username,
                        password: userPassword,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName
                    };

                    User.create(newUserData).then(function(newUser, created){
                        if(!newUser){
                            return done(null, false, req.flash("signUpMessage","There was an error creating you account. Please try again later."))

                  
                        }
                        if(newUser){
                            return done(null, newUser);
                        }
                    });
                } 
            })
        }
    ));

     //LOCAL SIGNIN
     passport.use('local-signin', new LocalStrategy(
 
        {
     
            // by default, local strategy uses username and password, we will override with username
     
            usernameField: 'username',
     
            passwordField: 'password',
     
            passReqToCallback: true // allows us to pass back the entire request to the callback
     
        },
     
     
        function(req, username, password, done) {
     
            var User = user;
     
            var isValidPassword = function(userpass, password) {
     
                return bCrypt.compareSync(password, userpass);
     
            }
     
            User.findOne({username: username}, function(err,user){
                if(err){
                    console.log("Error:", err);
     
                    return done(null, false, {
                        message: 'Something went wrong with your Signin'
                    });
                };
                if (!user) {
                    return done(null, false, req.flash("logInMessage", 'username does not exist'));
     
                }
     
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, req.flash("logInMessage", 'Incorrect password.'));
     
                }
                return done(null, user);
                
            });
     
     
        }
     
    ));
}
