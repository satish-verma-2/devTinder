const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 0
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
});

// const User = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);