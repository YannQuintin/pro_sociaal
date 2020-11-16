const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");
const Project = require("../models/Project.models");

const router = new Router();

//const router = new Router();

router.get("/createProjects", (req, res) => res.render("projects/createProjects"));

module.exports = router;