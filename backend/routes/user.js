const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");

router.use(bodyparser.json());

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 15).then((passhash) => {
    const newUser = new User({
      email: req.body.email,
      password: passhash,
    });
    newUser
      .save()
      .then((result) => {
        res.status(201).json({
          message: "New user added",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          message: "Auth failed.",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed.",
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        token: token,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth failed.",
      });
    });
});

module.exports = router;
