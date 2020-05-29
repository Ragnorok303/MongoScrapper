var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require ("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/headlinedb", { useNewUrlParser: true });
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

      var result = [];

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Headline.create(result)
        .then(function (dbheadline) {
          console.log(dbHeadline);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
    console.log(result);
  });
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/saved", function (req, res) {
  res.render("saved");
});

app.get("/api/fetch", function (req, res) {

  headlinesController.fetch(function (err, docs) {

    if (!docs || docs.insertedCount === 0) {
      res.json({
        message: "No new articles today. Check back tomorrow!"
      });
    }
    else {

      res.json({
        message: "Added " + docs.insertedCount + " new articles!"
      });
    }
  });
});

app.get("/api/headlines", function (req, res) {

  headlinesController.get(req.query, function (data) {

    res.json(data);
  });
});

app.delete("/api/headlines/:id", function (req, res) {

  var query = { _id: req.params.id };

  headlinesController.delete(query, function (err, data) {

    res.json(data);
  });
});

app.put("/api/headlines", function (req, res) {

  headlinesController.update(req.body, function (err, data) {

    res.json(data);
  });
});

app.get("/api/notes/", function (req, res) {

  notesController.get({}, function (err, data) {

    res.json(data);
  });
});

app.get("/api/notes/:headline_id", function (req, res) {
  var query = { _id: req.params.headline_id };

  notesController.get(query, function (err, data) {

    res.json(data);
  });
});

app.delete("/api/notes/:id", function (req, res) {
  var query = { _id: req.params.id };

  notesController.delete(query, function (err, data) {

    res.json(data);
  });
});


app.post("/api/notes", function (req, res) {
  notesController.save(req.body, function (data) {

    res.json(data);
  });
});

app.listen(PORT, function () {
  console.log("Listening on port:" + PORT);
});