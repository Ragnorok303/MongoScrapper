var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect( process.env.MONGODB_URI ||"mongodb://localhost/Headline", { useNewUrlParser: true});
console.log("mongoose connection is successful");

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

console.log("\n***********************************\n" +
  "Grabbing every thread name and link\n" +
  "from NYTIMES webdev board:" +
  "\n***********************************\n");

app.get("/scrape", function (req, res) {
  axios.get("https://www.nytimes.com").then(function (response) {

    var $ = cheerio.load(response.data);

    $("article").each(function (i, element) {

      var result = {};

      result.title = $(this)
        .text();
      result.link = $(this)
        .find("a")
        .attr("href");
      result.summary = $(this)
        .find("p")
        .text();

      db.Headline.create(result)
        .then(function (dbHeadline) {
          console.log(dbHeadline);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});



app.get("/", function (req, res) {
  res.render("home");
});

app.get("/saved", function (req, res) {
  res.render("saved");
});

app.get("/headlines", function (req, res) {
  db.Headline.find({})
    .then(function (dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/headlines", function (req, res) {
  db.Headline.find({})
    .then(function (dbHeadline) {
      res.send(dbHeadline);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/headlines/:id", function (req, res) {
  db.Headline.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/headlines/:id", function(req, res) {
  db.Note.create(req.body)
    .then( dbNote => db.Headline.findOneAndUpdate(
            {_id:req.params.id},
            {$push:{note:dbNote._id}})    
    )
    .then(dbHeadline => res.json(dbHeadline))
    .catch( err => res.json(500, err))  
});

app.put("/headlines/:id", function (req, res) {
  db.Headline.update()
    .then(dbHeadline => db.headline.findOneAndUpdate(
      { _id: req.params.id }, { $set: { saved: true } })
      .then(dbHeadline => res.json(dbHeadline))
      .catch(err => res.json(500, err)));
});

app.listen(PORT, function () {
  console.log("Listening on port:" + PORT);
});