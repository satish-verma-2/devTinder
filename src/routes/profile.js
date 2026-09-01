const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const token = cookies.token;
    // if(!token){
    //     throw new Error("Invalid token");
    // }
    // const decodedMessage = jwt.verify(token, "DEV@Tinder$790");
    // const {_id} = decodedMessage;
    // const user = await User.findById(_id);
    // if(!user){
    //     throw new Error("User does not exist");
    // }
    // console.log("decodedMessage", decodedMessage);
    // console.log("cookie", cookies);
    // console.log("user", user);
    const user = req.user;
    if (!user) {
      throw new Error("user does not exists");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("Error is : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      // res.status(400).send("invalid data");
      throw new Error(" invalid edit requests");
    }
    const loggedinUser = req.user;

    // this is also the way but right now will not use this
    // const updatedUser = {
    //   ...req.user,
    //   ...req.body,
    // };

    console.log(loggedinUser);
    Object.keys(req.body).forEach((key) => {
      loggedinUser[key] = req.body[key];
    });
    await loggedinUser.save();
    res.json({
      status: 200,
      message: `${loggedinUser.firstName}, your profile data updated succesfully`,
      data: loggedinUser,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = profileRouter;
