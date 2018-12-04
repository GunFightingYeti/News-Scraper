var express = require("express");
var mongoose = require("mongoose");

// Our scraping tools Axios is a promised-based http library, similar to
// jQuery's Ajax method It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

// Routes
app.get("/", function (req, res) {
    db.Article.find({saved: true})
    .then(function (dbSaved) {
      res.render("index", {dbSaved: dbSaved});
    })
    .catch(function (err) {
    // If an error occurred, log it
    console.log(err);
    });
});

// A GET route for scraping the website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://screenrant.com/movie-news/")
    .then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      $("article.browse-clip.half-thumb.js-content").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add all items to the result object
        result.title = $(this)
          .children("div")
          .children("h3")
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        result.image = $(this)
          .children("a")
          .children("div")
          .children("div")
          .children("picture")
          .children("source")
          .attr("data-srcset");
        result.excerpt = $(this)
          .children("div")
          .children("p")
          .text();

        db.Article.create(result)
        .catch(function (err) {
        console.log(err);
        });
    });
     db.Article.find({})
    .then(function (all) {
      res.render("scrape", {dbArticle: all});
    })        
    .catch(function (err) {
    console.log(err);
    });
  });
});

// A GET route for scraping the echoJS website
app.get("/saved", function (req, res) {

  db.Article.find({saved: true})
  .then(function (dbSaved) {
    res.render("saved", {dbSaved: dbSaved});
  })
  .catch(function (err) {
  // If an error occurred, log it
  console.log(err);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/save/:id", function (req, res) {

  db.Article.findOneAndUpdate(
    {_id: req.params.id},
    {$set: {saved: true}})
    .catch(function (err) {
      res.json(err);
    });
  });
  
  // Route for getting all Articles from the db
  app.get("/remove/:id", function (req, res) {

    db.Article.remove(
      {_id: req.params.id})
      .catch(function (err) {
        res.json(err);
      });
      
  });



// Start the server
app.listen(PORT, function () {
console.log("App running on port " + PORT + "!");
});
