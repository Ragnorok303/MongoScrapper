// var cheerio = require("cheerio");
// var axios = require("axios");

// console.log("\n***********************************\n" +
//             "Grabbing every thread name and link\n" +
//             "from NYTIMES webdev board:" +
//             "\n***********************************\n");

// axios.get("https://www.nytimes.com").then(function(response) {

//   var $ = cheerio.load(response.data);

//   var results = [];

//   $("article").each(function(i, element) {

//     var title = $(element).children().text();
//     var link = $(element).find("a").attr("href");

//     results.push({
//       title: title,
//       link: link
//     });
//   });

//   console.log(results);
// });
var request = require("request");
var cheerio = require("cheerio");

var scrape = function(cb) {
  
  request("http://www.nytimes.com", function(err, res, body) {
   
    var $ = cheerio.load(body);

    var articles = [];

    $(".theme-summary").each(function(i, element) {
     
      var head = $(this).children(".story-heading").text().trim();

      var url = $(this).children(".story-heading").children("a").attr("href");

      var sum = $(this).children(".summary").text().trim();

     if (head && sum && url) {
        
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

       

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: url
        };

        articles.push(dataToAdd);
      }
    });
  
    cb(articles);
  });
};

module.exports = scrape;