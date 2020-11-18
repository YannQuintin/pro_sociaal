const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET About us page */
router.get("/about-us", (req, res) => res.render("about-us"));

/* GET volunteers page */
router.get("/volunteers", (req, res) => res.render("volunteers"));


module.exports = router;
