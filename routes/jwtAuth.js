const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const knex = require('../knex/knex.js');
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");


//authorizeentication

router.post("/register", validInfo, async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = await knex.from("users").where("users.email", email);
    console.log("this is user", user);
    if (user.length > 0) {
      return res.status(401).json("User already exists!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await knex("users").insert({name, email, password: bcryptPassword}).returning('*');
    console.log("this is new user??", newUser);
    const jwtToken = jwtGenerator(newUser[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await knex.from("users").where("users.email", email);

    if (user.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      password,
      user[0].password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(user[0].user_id);
    return res.json({ jwtToken } );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.status(200).json({verified: true, user: req.user});
  } catch (err) {
    console.log("Error in verify...", err);
    res.status(500).json("Server error");
  }
});

module.exports = router;