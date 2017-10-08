//load passport strategies
const passport = require("passport");
const models = require("../models");
require("../config/passport.js")(passport, models.User);

module.exports = function(app) {
  app.get("/signup", function(req, res) {
    res.redirect("/");
  });

  app.get("/signin", function(req, res) {
    res.redirect("/");
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/dashboard",

      failureRedirect: "/"
    })
  );

  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",

      failureRedirect: "/"
    })
  );

  app.get("/edit", function(req, res) {
    res.render("user");
  });

  app.get("/edit/:id", function(req, res) {
    console.log("***********user Id: "+req.user.id);
    models.House
      .findAll({
        where: {
          id: req.params.id
        }
      })
      .then(function(houseData) {

        res.render("user", {houseData});
      });
  }); //closes get user

  app.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
      res.redirect("/");
    });
  });
};

//check to see if logged in middelware
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect("/signin");
// }
