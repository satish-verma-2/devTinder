const mongoose = require("mongoose");
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://vermasatish442_db_user:Vu0UqsRdQWdfCY3Z@cluster0.2i0fh81.mongodb.net/devTinder?appName=Cluster0");
}

module.exports = connectDB;


//below code would be placed in app.js file to connect to database and start the server only after successful connection to database

// connectDB().then(() => {
//     console.log("Database connected successfully");
// }).catch((err) => {
//     console.log("Database connection failed", err);
//     console.error("Database connection failed", err);
// });