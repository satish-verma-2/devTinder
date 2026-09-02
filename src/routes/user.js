const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestSchema");
const User = require("../models/User");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl about skills age gender";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl about skills age gender");
    // populate("fromUserId", ["firstName", "lastName"]); 
    //populate("fromUserId", "-password -email -createdAt -updatedAt -__v").exec();
    res.json({
      status: 200,
      message: "data fetched successfully",
      data: receivedRequests,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const connectionData = connections.map((row) =>{    
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        if(row.toUserId._id.toString() === loggedInUser._id.toString()){
            return row.fromUserId;
        }
    });

    res.json({
      status: 200,
      message: "data fetched successfully",
      data: connectionData,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user", async (req, res) => {
  const email = req.query.email;
  const user = await User.findOne({ email: email }).select("-password");
  if (!user) {
    return res.status(404).send({ message: "user not found" });
  } else {
    return res.send(user);
  }
});

//this is without error handling
//  authRouter.get("/feed", async (req, res)=>{
//     const users = await User.find();
//     res.send(users);
//  });

//this is with error handling using try catch block
// use try catch block to handle error in async await
// .then and .catch can also be used to handle error in async await
//  but try catch block is more readable and easy to understand
// when we use try catch block we can also use throw new Error() to throw error and catch it in catch block
//  but when we use .then and .catch we can only catch the error in catch block and cannot throw new error
// we use try catch for async await and .then and .catch for promise based code
// we can use try catch block for promise based code but it is not recommended because it is not readable and easy to understand
// in simple words .then and .catch ke sath jb async na ho and jb async ho to try catch ka use krna chahiye

// with try catch block
// authRouter.get("/feed", async (req, res)=>{
//     try {
//         const users = await User.find();
//         if (users.length === 0) {
//             return res.status(404).send({
//                 message: "No users found"
//             });
//         }else{
//             res.status(200).send(users);
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// with .then and .catch
userRouter.get("/feed", async (req, res) => {
  User.find()
    .then((users) => {
      if (users.length === 0) {
        return res.status(404).send({
          message: "No users found",
        });
      } else {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// delete a user from database using user id
userRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  // User.findByIdAndDelete(_id:userId)
  //Below is the short form of above code, we can use either of them
  User.findByIdAndDelete(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(200).send({
          message: "User deleted successfully",
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

userRouter.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updateData = req.body;
  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(updateData).every((update) =>
      ALLOWED_UPDATES.includes(update),
    );
    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid updates");
    }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      runValidators: true, // this will run the validators defined in the schema for the fields being updated
    });
    // console.log("user", user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User updated successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = userRouter;
