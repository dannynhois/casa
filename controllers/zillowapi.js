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


var parametersSearch = {
	address:address,
	citystatezip:citystatezip
};

zillow.get('GetDeepSearchResults',parametersSearch).then(function(results){
	var resultsString = results.response.results.result;
	var house = {
		address:results.request.address,
		price:resultsString[0].zestimate[0].amount[0]._,
		zpid:resultsString[0].zpid,
		year:resultsString[0].yearBuilt,
		sqft:resultsString[0].finishedSqFt,
		bedrooms:resultsString[0].bathrooms,
		bathrooms: resultsString[0].bedrooms
	}
	console.log(house);
});

var parametersSearch = {
	address:address,
	citystatezip:citystatezip
};

zillow.get('GetUpdatedPropertyDetails',parameters).then(function(results){
	var resultsString = results.response.results.result;
	var house = {
		address:results.request.address,
		price:resultsString[0].zestimate[0].amount[0]._,
		zpid:resultsString[0].zpid,
		year:resultsString[0].yearBuilt,
		sqft:resultsString[0].finishedSqFt,
		bedrooms:resultsString[0].bathrooms,
		bathrooms: resultsString[0].bedrooms
	}
	console.log(house);
});

// request.get(apicall, function(err,response,body){
// 	console.log(body);
// 	parseString(body, function(err, result){
// 		console.log(JSON.stringify(result.SearchResults.searchresults));
// 	});	
// });

