const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestSchema");
const User = require("../models/User");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      console.log("sending a connection request");
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }
    //   if (fromUserId.toString() === toUserId.toString()) {
    //     return res.status(400).send("You cannot send request to yourself");
    //   }
    
    //option for above code
    // we have also implemented this check in the connectionRequestSchema.js file as a pre save hook but we are also implementing it here to avoid unnecessary database calls 
    // either of them are good
    if (fromUserId.equals(toUserId)) {
        return res.status(400).send("You cannot send request to yourself");
      }


      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("User does not exist");
      }

      const existingRequest = await ConnectionRequest.findOne({
       $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).send("Request already sent");
      }     


      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({ message: "request send", data });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  },
);

module.exports = requestRouter;
