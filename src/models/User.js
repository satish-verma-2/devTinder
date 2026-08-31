const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender must be male, female or other");
            }
        }
        // enum: ["male", "female", "other"] // this allows only these three values for gender
    },
    photoUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    about: {
        type: String,
        maxLength: 200,
        default: "Hey there! I am using devTinder."
    },
    skills: {
        type: [String],
        default: []
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "Dev@Tinder$790",  {expiresIn: "1d"})
    return token;
    
}

userSchema.methods.validateThePassword = async function(passwordInputByUser){
    const user= this;
    const hashedPassword = user.password;
    const isPassowordValid = await bcrypt.compare(passwordInputByUser, hashedPassword);
    return isPassowordValid;

}

// const User = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);