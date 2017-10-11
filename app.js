/**
 * Module dependencies.
 */
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");

/**
 * Create Express server.
 */
const app = express();

app.use(express.static("public"));
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: ".env" });
const PORT = process.env.PORT || 8080;

/**
 * For Body Parser
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * For Passport
 * initialize passport and the express session and passport session and add them both as middleware.
 */
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//method override for put and delete
app.use(methodOverride("_method"));

//Models
var models = require("./models");

//Sync Database
models.sequelize
  .sync(
    // { force: true }
    //run this again if we change db setup
  )
  .then(function() {
    console.log("Nice! Database looks fine");
  })
  .catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
  });

/**
   * Set Handlebars as View Engine
   */
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/**
   * Controllers (route handlers).
   */
/*
 * Primary app routes.
 */
require("./controllers/home")(app);
require("./controllers/authcontroller")(app);
require("./controllers/comment")(app);
require("./controllers/apiRoute")(app);
// const authController = require("./controllers/authcontroller");
// const userController = require('./controllers/user');
// const apiController = require('./controllers/api');
// const contactController = require('./controllers/contact');

//load passport strategies
require("./config/passport.js")(passport, models.User);

//serialize
passport.serializeUser(function(user, done) {
  done(null, User.id);
});

// deserialize user
passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  });
});

/**
 * Start Express server.
 */
app.listen(PORT, () => {
  console.log("App is running at http://localhost:" + PORT);
});

module.exports = app;
