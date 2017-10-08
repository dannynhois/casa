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


	app.get("/settings",function(req,res){
		res.render("settings")
	});

/**
* GET User page (see all houses). will need to update this to show selected columns
*/
	app.get("/dashboard", middleware.isLoggedIn, function(req, res) {
		console.log("***********user Id: " + req.user.id);

		db.User.findAll({
			attributes:['user_choices']
		},{
			where:{
				id: req.user.id
			}
		}).then(function(choices){
			choicesArray = (choices[0].dataValues.user_choices).split(",");
			console.log(choicesArray);
			   
			houseAttributes = ['id','zpid','address','sqft','bedrooms','yearbuilt','zestimate'];
			houseAttributes.push.apply(houseAttributes,choicesArray);
			console.log(houseAttributes);
			db.House.findAll({
				attributes:houseAttributes
			},{
		        where: {
		            UserId: req.user.id
		  		}
		    }).then(function(houseData) {


		    	var houseData2 = {
		    		house: houseData,
		    		selectionTitles:choicesArrayCaps,
		    		selectionData:choicesArray
		    	}
		    	console.log(houseData2);
		        res.render("user", { houseData2 });
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
	}); //closes house post

/**
* Put Users page (selected values).
*/
	app.put("/usersettings", function(req,res){
		var userChoices = (Object.keys(req.body));
		console.log(userChoices);
		var stringChoices = userChoices.toString();
		console.log(stringChoices);
		//this is what we store to database
		db.User.update({
			user_choices:stringChoices
		},{where:{
			id:req.user.id
		}}).then(function(dbUser){
			res.redirect("/dashboard")
		});

		



	});//closes user post

}; //closes module exports


