/**
 * Dependencies
 */
var db = require("../models");
var Zillow = require("node-zillow");
var middleware = require("./middleware");
var scraper = require("./scraper");

module.exports = function(app) {
  /**
 * GET Home page.
 */
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/settings", function(req, res) {
    res.render("settings");
  });

  /**
* GET User page (see all houses).
*/
  app.get("/dashboard/:test?", middleware.isLoggedIn, function(req, res) {
    console.log("***********user Id: " + req.user.id);

    db.User
      .findAll({
        where: {
          id: req.user.id
        },
        attributes: ["user_choices"]
      })
      .then(function(choices) {
        //if we want to add more to the list shown in handlebars, add here
        houseAttributes = [
          "address",
          "zestimate",
          "sqft",
          "bedrooms",
          "zillowlink",
          "imagelink",
          "comments",
          "id"
        ];
        console.log(choices[0].dataValues.user_choices);
		//logs list of choices and creates full list of what will be shown on table
        if (choices[0].dataValues.user_choices) {
          var choicesArray = choices[0].dataValues.user_choices.split("-");
          console.log(choicesArray);
          houseAttributes.push.apply(houseAttributes, choicesArray);
        }

        db.House
          .findAll({
            where: {
              UserId: req.user.id
            },
            attributes: houseAttributes
          })
          .then(function(houseData) {
          	//sets a value for null fields so that they are detected as exiting in handlebars
  			houseData.forEach(house =>{
  				for (var key in house.dataValues){
  					if (house.dataValues[key] == null){
  						house.dataValues[key] = 'user input here';
  					}
  				};
  			});
  			
            //adds choicesArray for column names in handlebars
            for(var i = 0 ; i < choicesArray.length ; i++){
            	choicesArray[i] = choicesArray[i].charAt(0).toUpperCase() + choicesArray[i].substr(1);
            };
            houseData.list = choicesArray;
            //adds image link to each house in array to display
            houseData.forEach(house => {
              house.imagelink = JSON.parse(house.imagelink);
            });
            console.log(houseData);

            if (req.params.test) {
              console.log("rendering test page");
              res.render("dashboardcarousel", { houseData });
            }
            res.render("dashboard", { houseData });
          });
      });
  }); //closes get user

  /**
* Post Houses page (added house).
*/
  app.post("/houses", function(req, res) {
    // console.log(req);
    var parametersSearch = {
      address: req.body.address,
      citystatezip: req.body.city + ", " + req.body.state + " " + req.body.zip
    };
    var zwsid = "X1-ZWz1fx6rub800b_55f1z";
    var zillow = new Zillow(zwsid);

    var house = {};
    zillow
      .get("GetDeepSearchResults", parametersSearch)
      .then(function(results) {
        var resultsString = results.response.results.result;
        console.log(
          "************************ results:" +
            JSON.stringify(resultsString[0].links[0].homedetails)
        );
        house.address = results.request.address;
        house.citystatezip = results.request.citystatezip;
        house.price = resultsString[0].zestimate[0].amount[0]._;
        house.zpid = resultsString[0].zpid;
        // house.yearbuilt = resultsString[0].yearBuilt;
        house.sqft = resultsString[0].finishedSqFt;
        house.bedrooms = resultsString[0].bedrooms;
        house.link = resultsString[0].links[0].homedetails[0];
        console.log("call 1" + JSON.stringify(house));
      })
      .then(function() {
        //image scraper
        console.log("house link in scraper: ", house.link);
        scraper.scrape(house.link, function(data) {
          console.log("posted house " + house);
          var images = JSON.stringify(data);
          db.House
            .create({
              UserId: req.user.id,
              address: house.address,
              citystatezip: house.citystatezip,
              zpid: house.zpid,
              sqft: house.sqft,
              bedrooms: house.bedrooms,
              // yearbuilt: house.yearbuilt,
              zestimate: house.price,
              link: house.link,
              imagelink: images
            })
            .then(function(houseData) {
              res.redirect("/dashboard");
            });
        });
      });
  }); //closes house post

  /**
* Put Users page (selected values).
*/
  app.put("/usersettings", middleware.isLoggedIn, function(req, res) {
    console.log(req.body);
    var userChoices = Object.keys(req.body);
    console.log(userChoices);
    var stringChoices = userChoices.toString().replace(/,/g, "-");
    console.log(stringChoices);
    //this is what we store to database
    db.User
      .update(
        {
          user_choices: stringChoices
        },
        {
          where: {
            id: req.user.id
          }
        }
      )
      .then(function(dbUser) {
        res.redirect("/dashboard");
      });
  }); //closes user post

  //get route for modal call
  app.get("/api/house/:houseid", (req, res) => {
    db.House.findById(parseInt(req.params.houseid)).then(house => {
      console.log(house);
      res.json(house);
    });
  });

  //put route for modal call
  app.put("/houses", (req, res) => {
    db.House
      .update(req.body, {
        where: { id: req.body.id }
      })
      .then(function() {
        res.redirect("/dashboard");
      });
    //   res.json(req.body);
  });
}; //closes module exports
