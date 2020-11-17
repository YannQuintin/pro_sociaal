const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");
const Project = require("../models/Project.models");

const router = new Router();

//const router = new Router();
router.get("/projects", (req, res) => {
  Project.find()
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
  const { name, publisher, description, skillRequired, moneySaved } = req.body;

  Project.create({ name, publisher, description, skillRequired, moneySaved })
    .then((dbProject) =>
      User.findByIdAndUpdate(publisher, { $push: { projects: dbProject._id } })
      .populate("publisher")
    )
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