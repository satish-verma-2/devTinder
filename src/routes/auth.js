const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("hashPassword", passwordHash);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await user.save();

    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credencials!");
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validateThePassword(password);
    if (isPasswordValid) {
      // const token = await jwt.sign({_id:user._id}, "DEV@Tinder$790", {expiresIn: "1d"});
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).send("Login Successfull");
    } else {
      throw new Error("Invalid credencials!");
    }
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful!!");
});

module.exports = authRouter;
