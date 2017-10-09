var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();

var scraper = {};

//url - passed from api
scraper.scrape = function(url, cb) {
  //test url
  //   var url =
  //     "http://www.zillow.com/homedetails/9-Jennycliffe-Ln-Chesterfield-MO-63005/2779824_zpid/";
  console.log("url sent to scraper: ", url);

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
      console.log("html loaded into cheerio");

      // notice photos has class hip-photo
      // loop through all image url
      // should change /p_c/ to /p_f/ for larger image
      $(".hip-photo").filter(function() {
        var imgUrl = $(this).attr("href");
        // console.log(imgUrl);

        //added if statement as first image is sometimes null
        if (imgUrl) {
          imageLinks.push(imgUrl);
        }
      });
      // console.log("imglinks: ", imageLinks);
      //call back
      cb(imageLinks);
    }
  });
};

module.exports = scraper;
