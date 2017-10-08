/**
 * Dependencies
 */
var db = require("../models");
var Zillow = require("node-zillow");
var middleware = require("./middleware");

module.exports = function(app) {
  //add new comment
  app.post("/houses/:houseid/comments/", function(req, res) {
    db.Comment
      .create({
        comment: req.body.comment,
        UserId: req.body.userid, // will need to be req.user.id once form is completed
        HouseId: req.params.houseid
      })
      .then(function() {
        console.log("comment added successfully");
        res.send("comment added successfully");
      });
  });

  //edit comment
  app.put("/houses/:houseid/comments/:commentid", function(req, res) {
    db.Comment
      .update(
        {
          comment: req.body.comment
        },
        {
          where: {
            id: req.params.commentid
          }
        }
      )
      .then(function() {
        console.log("comment changed successfully");
        res.send("comment changed successfully");
      });
  });

  app.delete("/houses/:houseid/comments/:commentid", function(req, res) {
    db.Comment
      .destroy({
        where: {
          id: req.params.commentid
        }
      })
      .then(function() {
        res.send("comment deleted");
      });
  });

  //get comment
  app.get("/houses/:houseid/comments/", function(req, res) {
    res.send("got to comment get route");
  });
};
