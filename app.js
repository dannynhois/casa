/**
 * Module dependencies.
 */
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const path = require("path");

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: ".env" });
const PORT = process.env.PORT || 8080;

/**
 * Controllers (route handlers).
 */
const homeController = require("./controllers/home");
// const userController = require('./controllers/user');
// const apiController = require('./controllers/api');
// const contactController = require('./controllers/contact');

/**
 * Create Express server.
 */
const app = express();

/**
 * Set Handlebars as View Engine
 */
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/*
 * Primary app routes.
 */
app.get("/", homeController.index);

/**
 * Start Express server.
 */
app.listen(PORT, () => {
  console.log("App is running at http://localhost:" + PORT);
});

module.exports = app;
