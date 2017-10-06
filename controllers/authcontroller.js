var exports = (module.exports = {});

exports.signup = function(req, res) {
  res.render("signup");
};

exports.signin = function(req, res) {
  res.render("signin");
};

exports.dashboard = function(req, res) {
  res.render("dashboard");
};

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/");
  });
};

//check to see if logged in middelware
exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/signin");
};
