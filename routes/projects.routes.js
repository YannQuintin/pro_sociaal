const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");
const Project = require("../models/Project.models");

const router = new Router();

//const router = new Router();
router.get("/projects", (req, res) => {
  Project.find()
    .populate("publisher")
    .then((projectsFromDB) => {
      console.log(projectsFromDB);
      res.render("projects/projects", { projects: projectsFromDB });
    })
    .catch((err) =>
      console.log(`Error while getting the projects from the DB: ${err}`)
    );
});

// Get route to render the create project hbs
router.get("/projects/create", (req, res) => res.render("projects/create"));

// Post route to add the form data to db
router.post("/projects/create", (req, res) => {
  const { name, description, skillRequired, moneySaved } = req.body;
  const publisher = req.session.user;
  
  //console.log(publisher)
  Project.create({ name, publisher: publisher._id, description, skillRequired, moneySaved })
    .then((dbProject) =>{
      //const publisher = req.session.user;
      //Project.findOneAndUpdate({ _id: dbProject._id }, { publisher: publisher._id }, { new: true })
      //User.findByIdAndUpdate(publisher, { $push: { projects: dbProject._id } })
      //.populate("publisher")
    })
    .then(() => res.redirect("/user-profile"))
    .catch((err) =>
      console.error(`Err while creating the project in the DB: ${err}`)
    );
});



router.get("/projects/:id", (req, res) => {
  const { id } = req.params;

  Project.findById(id)
    .then((foundProject) => {
      console.log(foundProject);
      res.render("projects/show", foundProject);
    })
    .catch((error) => next(error));
});

/* 
// Display all projects from the db:
router.get("/", (req, res) => {
  Post.find()
    .populate("author") // --> we are saying: give me whole user object with this ID (author represents an ID in our case)
    .then((dbPosts) => {
      console.log(dbPosts);
      res.render("posts/list", { posts: dbPosts });
    })
    .catch((err) =>
      console.error(`Err while getting the posts from the DB: ${err}`)
    );
}); */



module.exports = router;


/*app.post("/product/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Review.create(req.body)
  .then(function(dbReview) {
  // If a Review was created successfully, find one Product with an `_id` equal to `req.params.id`. Update the Product to be associated with the new Review
  // { new: true } tells the query that we want it to return the updated Product -- it returns the original by default
  // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
  return db.Product.findOneAndUpdate({ _id: req.params.id }, { review: dbReview._id }, { new: true });
  }) */

  /*db.Product.findOne({ _id: req.params.id })
// ..and populate all of the notes associated with it
.populate("review")
.then(function(dbProduct) { */