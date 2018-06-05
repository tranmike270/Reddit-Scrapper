// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================

//Basic Dependencies for express and MongoDB
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan')

// Dependencies for Passport
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;

// Sets up the Express App and PORT
var app = express();
var PORT = process.env.PORT || 8080;

// Require all models
var db = require("./models");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// parse cookies
app.use(cookieParser());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
})); 
  
// Passport init
app.use(passport.initialize());
app.use(passport.session());
  
  
// Connect Flash
app.use(flash());
  
// Global Vars
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});




// Routes
// =============================================================
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);
require('./routes/userAuth.js')(app, passport);

//load passport strategies
 
require('./config/passport.js')(passport, db.User);



var uristring = process.env.MONGODB_URI || 'mongodb://localhost/reddit_scrapper';
// Connecting Mongoose for mongodb
mongoose.connect(uristring, function(err,res){
    if (err) { 
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
        console.log ('Succeeded connected to: ' + uristring);
      }
});
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});