const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const colors = require("colors");

const User = require("../models/user");

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
        const token = jwt.sign(
          {
            email: result.email,
            userId: result._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(201).json({
          token: token,
          expiresIn: 3600,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
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
        // duration in secounds until it expires
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
});

module.exports = router;
