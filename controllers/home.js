/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    res.render('index', {
        title: 'Home'
    });
};


var db = require("../models");
module.exports = function(app) {
    app.get("/user/:id", function(req, res) {
        db.House.findAll({
            where: {
                user_id: req.params.id
            }
        }).then(function(dbHouses) {
            res.render('user', dbHouses);
        });
    });

    app.post("/user/:id", function(req, res) {
        //call zillow
        db.House.create({
            where: {
                user_id: req.params.id
            }
        }).then(function(dbHouses) {
            res.render('user', dbHouses);
        });
    });

};