/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('index', {
    title: 'Home'
  });
};

// 
// var db = require("../models");
//
// app.get("/user/:id", function(req,res) {
// 	db.House.findAll({
// 		where:{
// 			user_id: req.params.id
// 		}
// 	});
//
// 	res.render('user', {
//
// 	});
// });
