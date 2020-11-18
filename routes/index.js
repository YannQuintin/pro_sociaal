const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.use(["/projects","/projects/create","/user-profile"],
        
    (req, res, next) => {
    if(req.session.user) {
        next();
    } else{
        res.redirect("/login");
    }
});

module.exports = router;
