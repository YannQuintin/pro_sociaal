const express = require('express');
const User = require("../models/User.model");
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


/* GET About us page */
router.get("/about-us", (req, res) => res.render("about-us"));

/* GET volunteers page: render all users profiles */
router.get("/volunteers", (req, res) => {
    User.find()
      .populate("user")
      .then((usersFromDB) => {
        res.render("volunteers", {
          users: usersFromDB
        });
      })
      .catch((err) =>
        console.log(`Error while getting the users from the DB: ${err}`)
      );
});

// router for users in session OR redirect to login
router.use(["/projects","/projects/create","/user-profile", "/volunteers", ],
        
    (req, res, next) => {
    if(req.session.user) {
        next();
    } else{
        res.redirect("/login");
    }
});



module.exports = router;
