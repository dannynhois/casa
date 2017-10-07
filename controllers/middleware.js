const passport = require("passport");
const models = require("../models");
require("../config/passport.js")(passport, models.User);

var middleware = {
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect("/signin");
    }
};


module.exports = middleware;