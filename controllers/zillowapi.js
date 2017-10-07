var express = require("express");
var request = require("request");
// var parseString = require("xml2js").parseString;
var zwsid = "X1-ZWz1fx6rub800b_55f1z"
var Zillow = require("node-zillow");
var zillow = new Zillow(zwsid);

var urlbase = "http://www.zillow.com/webservice/GetDeepSearchResults.htm";

//data below is dummy data - this will be populated by the user eventually
var address = "1903 Bradshaw St";
var citystatezip = "Houston, TX 77008";

var house = {}


var parametersSearch = {
	address:address,
	citystatezip:citystatezip
};

zillow.get('GetDeepSearchResults',parametersSearch).then(function(results){
	var resultsString = results.response.results.result;
		house.address=results.request.address,
		house.price=resultsString[0].zestimate[0].amount[0]._,
		house.zpid=resultsString[0].zpid,
		house.year=resultsString[0].yearBuilt,
		house.sqft=resultsString[0].finishedSqFt,
		house.bedrooms=resultsString[0].bathrooms,
		house.bathrooms= resultsString[0].bedrooms

	console.log("call 1"+JSON.stringify(house));
});

// var parametersImg = {
// 	zwsid:zwsid,
// 	zpid:27760273
// };

// zillow.get('GetUpdatedPropertyDetails',parametersImg).then(function(results){
// 	console.log("call 2"+JSON.stringify(results));
	
// });


