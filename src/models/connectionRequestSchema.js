const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, require: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, require: true },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["ignored", "intrested", "rejected", "accepted"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

//same logic is being implemented in the request.js file to avoid unnecessary database calls but this is also a good way to implement it
// inside the pre save hook async function can be used but we have to use next() to move to the next middleware or save the document
//agar async use kiya to next ko call krne ki jrurt ni vrna error dega

// connectionRequestSchema.pre("save", async function (next) {
//   const connectionRequest = this;
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     throw new Error("Cannot send request to yourself....");
//   }
// //   next();
// });

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
module.exports = ConnectionRequestModel;
