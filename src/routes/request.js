const express = require("express");
const requestRouter = express.Router();
const { Types } = require("mongoose");

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

      const allowedStatus = ["ignored", "interested"];
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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const requestId = req.params.requestId; // this is connection request id (_id)
      const status = req.params.status;

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).send("Invalid status");
      }

    //   console.log("Query params:", {
    //     requestId,
    //     requestIdConverted: new Types.ObjectId(requestId).toString(),
    //     loggedInUserId: loggedInUser._id.toString(),
    //     status: "intrested",
    //   });

      const connectionRequest = await ConnectionRequest.findOne({
        _id: new Types.ObjectId(requestId),
        toUserId: loggedInUser._id,
        status: "interested",
      });
      
      console.log("Found request:", connectionRequest);
      
      if (!connectionRequest) {
        return res.status(404).send("connection request not found");
      }
      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();
      res.json({ message: "request reviewed", data: updatedRequest });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  },
);

module.exports = requestRouter;
