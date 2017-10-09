var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();

var scraper = {}

//url - passed from api
scraper.scape = function(url, cb) {
    //test url
  //   var url =
  //     "http://www.zillow.com/homedetails/9-Jennycliffe-Ln-Chesterfield-MO-63005/2779824_zpid/";

  var imageLinks = [];

  //headers needed to scrape zillow
  var options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: url
  };
  request(options, function(error, response, html) {
    //run if no error
    if (!error) {
      //load html
      var $ = cheerio.load(html);

      // notice photos has class hip-photo
      // loop through all image url
      // should change /p_c/ to /p_f/ for larger image
      $(".hip-photo").filter(function() {
        var imgUrl = $(this).attr("href");
        // console.log(imgUrl);
        imageLinks.push(imgUrl);
      });
      console.log("imglinks: ", imageLinks);
    //call back
    cb(imageLinks);
    }
  });

}

module.exports = scraper;
