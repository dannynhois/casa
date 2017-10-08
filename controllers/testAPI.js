// for zillow
var Zillow = require("node-zillow");
var _ = require("lodash");

// for scraper
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var scraper = require('./scraper');

// for express
var express = require("express");
var app = express();

app.get("/", (req, res) => {
  var parametersSearch = {
    address: "9 Jennycliffe Ln",
    citystatezip: "Chesterfield, MO 63005"
  };
  var zwsid = "X1-ZWz1fx6rub800b_55f1z";
  var zillow = new Zillow(zwsid);

  var house = {};
  // call api
  zillow.get("GetDeepSearchResults", parametersSearch).then(function(data) {
    // link to main page
    house.link = data.response.results.result[0].links[0].homedetails[0];

    //pass this url to scraper
    var url = house.link;

    //pass a url and scraper returns an array of image links. first is undefined for some reason
    var a = scraper.scape(url, (x)=>{
        console.log('a-url: ',x);
        console.log(JSON.stringify(x));
        console.log(JSON.parse(JSON.stringify(x)));

    });



    // url = http://www.zillow.com/homedetails/9-Jennycliffe-Ln-Chesterfield-MO-63005/2779824_zpid/
    //aurl = https://www.zillow.com/homedetails/9-Jennycliffe-Ln-Chesterfield-MO-63005/2779824_zpid/
  });
});

app.listen(8081, () => {
  console.log("http://localhost:8081");
});
