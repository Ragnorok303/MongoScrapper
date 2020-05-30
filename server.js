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

mongoose.connect("mongodb://localhost/headlinedb", { useNewUrlParser: true, useUnifiedTopology: true });
console.log("mongoose connection is successful");

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

console.log("\n***********************************\n" +
  "Grabbing every thread name and link\n" +
  "from NYTIMES webdev board:" +
  "\n***********************************\n");

axios.get("https://www.nytimes.com").then(function (response) {

  var $ = cheerio.load(response.data);

  var result = [];

  $("article").each(function (i, element) {

    var title = $(element).text();

    var link = $(element).find("a").attr("href");

    result.push({
      title: title,
      link: link
    });

  });
  console.log(result);
});


app.get("/", function (req, res) {
  res.render("home");
});

app.get("/saved", function (req, res) {
  res.render("saved");
});

app.get("/api/headlines", function (req, res) {
  (req.query, function (data) {
    res.json(data);
  });
});

app.delete("/api/headlines/:id", function (req, res) {
  var query = { _id: req.params.id };
  (query, function (err, data) {
    res.json(data);
  });
});

app.put("/api/headlines", function (req, res) {
  (req.body, function (err, data) {
    res.json(data);
  });
});

app.get("/api/notes/", function (req, res) {
  ({}, function (err, data) {
    res.json(data);
  });
});

app.get("/api/notes/:headline_id", function (req, res) {
  var query = { _id: req.params.headline_id };
  (query, function (err, data) {
    res.json(data);
  });
});

app.delete("/api/notes/:id", function (req, res) {
  var query = { _id: req.params.id };
  (query, function (err, data) {
    res.json(data);
  });
});

app.post("/api/notes", function (req, res) {
  (req.body, function (data) {
    res.json(data);
  });
});

app.listen(PORT, function () {
  console.log("Listening on port:" + PORT);
});