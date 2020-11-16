const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");
const Project = require("../models/Project.models");

const router = new Router();

//const router = new Router();


// Get route to render the create project hbs
router.get("/projects/create", (req, res) => res.render("projects/createProjects"));

// Post route to add the form data to db
router.post("/projects/new", (req, res, next) => {
  const { name, description, skillRequired, moneySaved } = req.body;

  Movie.create({ name, description, skillRequired, moneySaved })
    .then((newProjectSavedInDB) => {
      console.log(newProjectSavedInDB);
      res.redirect("/projects");
    })
    .catch((error) => next(error));
});


router.get("/projects/:id", (req, res) => {
  const { id } = req.params;

  Project.findById(id)
    .populate("cast")
    .then((foundMovie) => {
      console.log(foundMovie);
      res.render("movies/show", foundMovie);
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