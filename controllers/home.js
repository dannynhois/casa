/**
 * GET /
 * Home page.
 */

 /**
 * Dependencies
 */
var db = require("../models");
var Zillow = require("node-zillow");

var exports = (module.exports = {});
/**
 * GET Home page.
 */
exports.index = function(req, res){
    res.render("index");
};

/**
 * GET User page.
 */
exports.mylist = function(req, res){
    db.House.findAll({
        where: {
            // user_id: req.params.id
            address:"1903 Bradshaw St"
        }
    }).then(function(houseData) {
        res.render('user', {houseData});
    });
};

// var db = require("../models");

// app.get("/user/:id", function(req,res) {
// 	db.House.findAll({
// 		where:{
// 			user_id: req.params.id;
// 		}
// 	})

// 	res.render('user', {

// 	})
// })
// module.exports = function(app) {
// app.get("/user/:id", function(req, res) {
//     db.House.findAll({
//         where: {
//             user_id: req.params.id
//         }
//     }).then(function(houseData) {
//         res.render('user', {houseData});
//     });
// });

// app.post("/user/:id", function(req, res) {
// //     var parametersSearch = {
// //         address: req.body.address,
// //         citystatezip: req.body.citystatezip
// //     };
// var zwsid = "X1-ZWz1fx6rub800b_55f1z";
// var zillow = new Zillow(zwsid);
// var parametersSearch = {
//     address: "1903 Bradshaw St",
//     citystatezip: "Houston, TX 77008"
// };
// var house = {};
// zillow.get('GetDeepSearchResults', parametersSearch).then(function(results) {
//     var resultsString = results.response.results.result;
//     house.address = results.request.address;
//     house.citystatezip = results.request.citystatezip;
//     house.price = resultsString[0].zestimate[0].amount[0]._;
//     house.zpid = resultsString[0].zpid;
//     house.year = resultsString[0].yearBuilt;
//     house.sqft = resultsString[0].finishedSqFt;
//     house.bedrooms = resultsString[0].bedrooms;

//     console.log("call 1" + JSON.stringify(house));
// }).then(function() {
//     console.log(house);
//     db.House.create({
//         user_id: "test5",
//         address: house.address,
//         citystatezip: house.citystatezip,
//         zpid: house.zpid,
//         sqft: house.sqft,
//         bedrooms: house.bedrooms,
//         yearbuilt: house.yearbuilt,
//         zestimate: house.price
//     });
//     });
//     // .then(function() {
// //         res.render('user', dbHouses);
// //     });

// });
// };
