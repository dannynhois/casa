var db = require("../models");

module.exports = function(app) {
  //get route for modal call
  app.get("/api/house/:houseid", (req, res) => {
    db.House
      .findOne({
        where: {
          id: parseInt(req.params.houseid)
        },
        include: [{
            model:db.User
        }]
      })
      .then(house => {
        console.log(house);
        res.json(house);
      });
  });

  app.get("/api/house/", (req, res) => {
    db.House
      .findAll({
        include: [{
            model:db.User
        }]
      })
      .then(house => {
        console.log(house);
        res.json(house);
      });
  });
};
