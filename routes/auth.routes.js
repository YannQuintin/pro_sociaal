const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {Router} = require("express");
const User = require("../models/User.model");
const fileUploader = require('../configs/cloudinary.config');

const router = new Router();
const saltRounds = 10;

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("auth/login", {
      email, errorMessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          email,
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", {
          email,
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((error) => next(error));
});

router.post("/signup", fileUploader.single('image'), (req, res, next) => {
  const { name, email, password, profession, description , skill} = req.body;

  if (!name || !email || !password || !profession) {
    res.render("auth/signup", {
      name, email, errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  const emailFormatRegex = /^\S+@\S+\.\S+$/;
  if (!emailFormatRegex.test(email)) {
    res.status(500).render("auth/signup", {
      email,
      name,
      profession,
      description,
      skill,
      validationError: "Please use a valid email address.",
    });
    return;
  }

  /* // Strong password pattern.
  const strongPasswordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  // Validate that incoming password matches regex pattern.
  if (!strongPasswordRegex.test(password)) {
    res.status(500).render("auth/signup", {
      email,
      username,
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }*/

  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) =>
      User.create({ name, email, password: hashedPassword, profession, description , skill , imageUrl: req.file.path  })
        .then((newUser) => {
          req.session.user = newUser;
          res.redirect("/user-profile");
        })

        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render("auth/signup", {
              name, email, profession, description, skill,
              validationError: error.message,
            });
          } else if (error.code === 11000) {
            res.status(500).render("auth/signup", {
              name, email, profession, description, skill,
              errorMessage:
                "Email is already used.",
            });
          } else {
            next(error);
          }
        })
    )
    .catch((err) => next(err));
});

router.get("/user-profile", (req, res) => {
  User.findOne({
      _id: req.session.user._id
    })
    .populate("projects")
    .then(userWithProjects => {
      res.render("user/profile", {
        user: userWithProjects
      });
    })
});

// 5. GET route ==> to render the login form to user
router.get("/login", (req, res) => res.render("auth/login"));

// 6. POST route ==> to process form data (don't forget to compare with bcrypt ;{ )
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  // get the data from login form
  const {
    email,
    password
  } = req.body;

  // Validate that incoming data is not empty.
  if (!email || !password) {
    res.render("auth/login", {
      email,
      errorMessage: "All fields are mandatory. Please provide your email and password.",
    });
    return;
  }

  // find user and send correct response
  User.findOne({
      email
    })
    .then((user) => {
      // check if found user was an object or null
      if (!user) {
        res.render("auth/login", {
          email,
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", {
          email,
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((error) => next(error));
});


//!! User UPDATE 
router.get("/user/:id/edit", (req, res, next) => {
  const {
    id
  } = req.params;

  User.findById(id)
    .then((foundUserFromDB) =>
      res.render("user/edit", foundUserFromDB)
    )
    .catch((error) => next(error));
});

router.post("/user/:id", fileUploader.single('image'),(req, res, next) => {
  const { id } = req.params;
  const { name, email, profession, description, skill, } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, email, profession, description, skill, imageUrl: req.file.path },
    { new: true }
  )
    .then(res.redirect("/user-profile"))
    .catch((error) => next(error));
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


// Get route to render a specific user profile from a logged in user
//TODO 1. add in-session user only access to this page 2. 

router.get("/user/:id", (req, res, next) => {
  const {
    id
  } = req.params;
  
  User.findById(id)
  .then((foundUser) => {
      console.log(foundUser);
      res.render("user/show", foundUser);
    })
    .catch((error) => next(error));
});


module.exports = router;