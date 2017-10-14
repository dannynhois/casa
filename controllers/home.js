/**
 * Dependencies
 */
var db = require("../models");
var Zillow = require("node-zillow");
var middleware = require("./middleware");
var scraper = require("./scraper");
var geocoder = require("geocoder");

module.exports = function(app) {
    /**
     * GET Home page.
     */
    app.get("/", function(req, res) {
        res.render("index");
    });
    /**
     * GET Home page.
     */
    app.get("/settings", function(req, res) {
        res.render("settings");
    });

    /**
     * GET User page (see all houses).
     */
    app.get("/dashboard/:test?", middleware.isLoggedIn, function(req, res) {
        console.log("***********user Id: " + req.user.id);
        var choicesArray = [];
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
                    choicesArray = choices[0].dataValues.user_choices.split("-");
                    console.log("line 50 " + choicesArray);
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
                        houseData.forEach(house => {
                            for (var key in house.dataValues) {
                                if (house.dataValues[key] == null || house.dataValues[key] == "") {
                                    house.dataValues[key] = '  ';
                                }
                            };
                        });

                        //adds choicesArray for column names in handlebars
                        houseData.lowerlist = choicesArray;
                        console.log("lower list " + houseData.lowerlist);
                        for (var i = 0; i < choicesArray.length; i++) {
                            choicesArray[i] = choicesArray[i].charAt(0).toUpperCase() + choicesArray[i].substr(1);
                        };
                        houseData.list = choicesArray;
                        console.log("list " + houseData.list);

                        //adds image link to each house in array to display
                        houseData.forEach(house => {
                            house.imagelink = JSON.parse(house.imagelink);
                        });

                        //get lat & long for map marker


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
            	//lat and lng for google maps
            	geocoder.geocode( house.address+" "+house.citystatezip, function(err, data) {
            		console.log("************ geocode "+JSON.stringify(data.results[0].geometry.location));
            		var lat = data.results[0].geometry.location.lat;
            		var lng = data.results[0].geometry.location.lng;
            	
            	
                //image scraper
                console.log("house link in scraper: ", house.link);
                scraper.scrape(house.link, function(data) {
                    console.log("posted house " + house);
                    var images = JSON.stringify(data);
                    var zPrice = parseInt(house.price);
                    var zPriceFormat= zPrice.toLocaleString();
                    console.log("********** "+zPriceFormat);
                    console.log(house.link);
                    db.House
                        .create({
                            UserId: req.user.id,
                            address: house.address,
                            citystatezip: house.citystatezip,
                            zpid: house.zpid,
                            sqft: house.sqft,
                            bedrooms: house.bedrooms,
                            // yearbuilt: house.yearbuilt,
                            zestimate: zPriceFormat,
                            zillowlink: house.link,
                            imagelink: images,
                            lat:lat,
                            lng:lng
                        })
                        .then(function(houseData) {

                        	console.log("*********Line 149: "+houseData.dataValues)
                            res.redirect("/dashboard");
                        });
                });
                });
            });
    }); //closes house post

    /**
     * Put Users page (selected values).
     */
    app.put("/usersettings", middleware.isLoggedIn, function(req, res) {
        console.log("Line 163 " + req.body);
        var userChoices = Object.keys(req.body);
        console.log(userChoices);
        var stringChoices = userChoices.toString().replace(/,/g, "-");
        console.log(stringChoices);
        //this is what we store to database
        db.User
            .update({
                user_choices: stringChoices
            }, {
                where: {
                    id: req.user.id
                }
            })
            .then(function(dbUser) {
                res.redirect("/dashboard");


            });
    }); //closes user post



    //put route for modal call
    app.put("/houses", (req, res) => {
        console.log("Line 193 " + JSON.stringify(req.body));
        //only need this because handlebars ids are 1st letter caps for some reason
        var key, keys = Object.keys(req.body);
        var n = keys.length;
        var lowerObj = {}
        while (n--) {
            key = keys[n];
            lowerObj[key.toLowerCase()] = req.body[key];
        }
        console.log(lowerObj);
        db.House
            .update(lowerObj, {
                where: { id: req.body.id }
            })
            .then(function() {
                res.redirect("/dashboard");
            });
        //   res.json(req.body);
    });

    app.delete("/houses/:id",(req,res) => {
    	console.log()
    	db.House.destroy({
    		where:{
    			id:req.params.id
    		}
    	}).then(function(dbHouse){
    		res.redirect("/dashboard");
    	})
    })
}; //closes module exports