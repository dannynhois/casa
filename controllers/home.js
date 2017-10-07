/**
 * GET /
 * Home page.
 */

/**
 * Dependencies
 */
var db = require("../models");
var Zillow = require("node-zillow");
var middleware = require("./middleware");


module.exports = function(app) {
        /**
         * GET Home page.
         */
app.get("/", function(req, res) {
res.render("index");
});

/**
* GET User page.
*/
app.get("/dashboard", middleware.isLoggedIn, function(req, res) {
	console.log("***********user Id: " + req.user.id);
	db.House
	    .findAll({
	        where: {
	            UserId: req.user.id
	        }
	    })
	    .then(function(houseData) {

	        res.render("user", { houseData });
	    }); //closes get user


	app.post("/houses", function(req, res) {
	    // console.log(req);
	    var parametersSearch = {
	        address: req.body.address,
	        citystatezip: req.body.city + ", " + req.body.state + " " + req.body.zip
	    };
	    var zwsid = "X1-ZWz1fx6rub800b_55f1z";
	    var zillow = new Zillow(zwsid);

	    var house = {};
	    zillow.get('GetDeepSearchResults', parametersSearch).then(function(results) {

	        var resultsString = results.response.results.result;

	        console.log("************************ results:" + JSON.stringify(resultsString[0].links[0].homedetails));
	        house.address = results.request.address;
	        house.citystatezip = results.request.citystatezip;
	        house.price = resultsString[0].zestimate[0].amount[0]._;
	        house.zpid = resultsString[0].zpid;
	        house.year = resultsString[0].yearBuilt;
	        house.sqft = resultsString[0].finishedSqFt;
	        house.bedrooms = resultsString[0].bedrooms;
	        house.link = resultsString[0].links[0].homedetails[0];
	        console.log("call 1" + JSON.stringify(house));

	    }).then(function() {
	        console.log("posted house " + house);
	        console.log(req.user);
	        db.House.create({
	            UserId: req.user.id,
	            address: house.address,
	            citystatezip: house.citystatezip,
	            zpid: house.zpid,
	            sqft: house.sqft,
	            bedrooms: house.bedrooms,
	            yearbuilt: house.yearbuilt,
	            zestimate: house.price,
	            link: house.link
	        });
	    }).then(function(houseData) {
	        res.redirect("/dashboard");
	    });
	}); //closes post
});
    }; //closes module exports


