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


// router for users in session OR redirect to login
router.use(["/projects","/projects/create","/user-profile","/volunteers", ],
        
    (req, res, next) => {
    if(req.session.user) {
        next();
    } else{
        res.redirect("/login");
    }
});



module.exports = router;
