const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");

const router = new Router();
const saltRounds = 10;


// 2. GET route ==> to display the signup form to users.
router.get("/signup", (req, res) => res.render("auth/signup"));

// 3. POST route ==> to process form data (don't forget to hash the password with bcrypt ;{ )
router.post("/signup", (req, res, next) => {
  const { name, email, password, profession, description , skill} = req.body;

  // Validate that incoming data is not empty.
  if (!name || !email || !password || !profession) {
    res.render("auth/signup", {
      name,
      email,
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  const emailFormatRegex = /^\S+@\S+\.\S+$/;

  if (!emailFormatRegex.test(email)) {
    res.status(500).render("auth/signup", {
      email,
      username,
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

  // First use bcrypt to hash incoming password
  bcrypt
    .hash(password, saltRounds)
    // Create new user with the hashed password
    .then((hashedPassword) =>
      User.create({ name, email, password: hashedPassword, profession, description , skill  })
        .then((newUser) => {
          // add user to session.
          req.session.user = newUser;

          // redirect to user profile.
          res.redirect("/user-profile");
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render("auth/signup", {
              name,
              email,
              profession,
              description,
              skill,
              validationError: error.message,
            });
          } else if (error.code === 11000) {
            res.status(500).render("auth/signup", {
              name,
              email,
              profession,
              description,
              skill,
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

// 4. GET route ==> to render the profile page of the user.
router.get("/user-profile", (req, res) => {
  res.render("user/profile", { user: req.session.user });
});




// 5. GET route ==> to render the login form to user
router.get("/login", (req, res) => res.render("auth/login"));

// 6. POST route ==> to process form data (don't forget to compare with bcrypt ;{ )
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  // get the data from login form
  const { email, password } = req.body;

  // Validate that incoming data is not empty.
  if (!email || !password) {
    res.render("auth/login", {
      email,
      errorMessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return;
  }

  // find user and send correct response
  User.findOne({ email })
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


//!! PROJECT UPDATE WIP
// GET route to render a single user to be edited
router.get("/user/{{user._id}}/edit", (req, res, next) => {
const { id } = req.params;

  User.findById(id)
    .then((foundUserFromDB) =>
      res.render("user/{{user._id}}/edit", foundUserFromDB)
    )
    .catch((error) => next(error));
});

// POST route to submit a specific project edits
router.post("/user/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, email, profession, description, skill } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, email, profession, description, skill },
    { new: true }
  )
    .then((updatedUser) => res.redirect("/user-profile"))
    .catch((error) => next(error));
});


//!! PROJECT DELETE WIP
//POST route to delete a specific project
router.post("/project/:id/delete", (req, res, next) => {
  const { id } = req.params;

  Project.findByIdAndDelete(id)
    .then(() => res.redirect("/projects"))
    .catch((error) => next(error));
});

// 7. POST
router.post("/logout", (req, res) => {
  // Alternative 1 for logging out
  req.session.destroy();
  res.redirect("/");

  // Alternative 2 for logging out
  /* req.session.destroy(() => {
    res.redirect("/");
  }); */
});

module.exports = router;