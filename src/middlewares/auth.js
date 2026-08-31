const jwt = require("jsonwebtoken");
const User = require("../models/User");



const userAuth = async (req, res, next)=>{
    try{
        // const token = req.cookies.token; 
        //or
        const {token} = req.cookies;
        if(!token){
            throw new Error("invalid token!");
        }
        const decodeToken = jwt.verify(token, "Dev@Tinder$790");
        // const _id = decodeToken._id;
        // Or
        const {_id} = decodeToken;
        const user = await User.findById(_id);
        req.user=user;
        next();

    } catch(err){
        res.status(400).send("Err "+ err.message);

    }

}

module.exports={
    userAuth
}