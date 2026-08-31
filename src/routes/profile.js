const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");



profileRouter.get("/profile", userAuth, async (req, res)=>{
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
    if(!user){
        throw new Error("user does not exists");
    }
    res.status(200).send(user);
    } catch(err){
        res.status(400).send("Error is : "+ err.message);
    }
});

module.exports = profileRouter;