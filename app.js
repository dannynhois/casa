/**
 * Module dependencies.
 */
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const path = require("path");

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

//Models
var models = require("./models");

//Sync Database
models.sequelize
  .sync()
  .then(function() {
    console.log("Nice! Database looks fine");
  })
  .catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
  });

/**
 * Controllers (route handlers).
 */
const homeController = require("./controllers/home");
const authController = require("./controllers/authcontroller");
// const userController = require('./controllers/user');
// const apiController = require('./controllers/api');
// const contactController = require('./controllers/contact');

/**
 * Set Handlebars as View Engine
 */
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/*
 * Primary app routes.
 */
//app.get("/", homeController.index);
app.get("/signup", authController.signup);
app.get("/signin", authController.signin);
app.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/dashboard",

    failureRedirect: "/signup"
  })
);
app.post(
  "/signin",
  passport.authenticate("local-signin", {
    successRedirect: "/dashboard",

    failureRedirect: "/signin"
  });
);
app.get("/dashboard", authController.isLoggedIn, authController.dashboard);
app.get("/logout", authController.logout);

//load passport strategies
require("./config/passport.js")(passport, models.user);

//serialize
passport.serializeUser(function(user, done) {
  done(null, user.id);
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
