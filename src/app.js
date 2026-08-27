require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
app.use(express.json());
// console.log("process.env.MONGO_URI", process.env.MONGO_URI);
app.post("/signup", async (req, res)=>{
    // const userObject = {
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     password: req.body.password,
    //     age: req.body.age,
    //     gender: req.body.gender
    // };
    const user = new User(req.body);
    user.save().then((user)=>{
        res.send(user);
    
    }).catch((err)=>{
        res.status(500).send(err);
    });

});

app.get("/user", async (req, res)=>{
    const email = req.body.email;
    const user = await User.findOne({email: email});
    if(!user){
        res.status(404).send("user not found");
    } else {
        res.send(user);
    }
})

//this is without error handling
//  app.get("/feed", async (req, res)=>{
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
// app.get("/feed", async (req, res)=>{
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
app.get("/feed", async (req, res)=>{
    User.find().then((users)=>{
        if (users.length === 0) {
            return res.status(404).send({
                message: "No users found"
            });
        }else{
            res.status(200).send(users);
        }}).catch((err)=>{
            res.status(500).send(err);
        });
    });

// delete a user from database using user id
app.delete("/user", async (req, res)=>{
    const userId = req.body.userId;
    // User.findByIdAndDelete(_id:userId)
    //Below is the short form of above code, we can use either of them
    User.findByIdAndDelete(userId).then((user)=>{
        if(!user){
            return res.status(404).send({
                message: "User not found"
            });
        }else{
            res.status(200).send({
                message: "User deleted successfully"
            });
        }
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

app.patch("/user", async (req, res)=>{
    const userId = req.body.userId;
    const updateData = req.body;
   try{
    const user = await User.findByIdAndUpdate(userId, updateData)
    console.log("user", user);
    if(!user){
        return res.status(404).send("User not found");}
    res.status(200).send("User updated successfully");
   } catch(err){
        res.status(500).send(err);
    };
});


connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000,()=>console.log("app is running on port 3000"));

}).catch((err) => {
    console.log("Database connection failed", err);
    console.error("Database connection failed", err);
});

// app.use("/user", (req, res, next)=>{
//     console.log("this is second middleware");
//     next();
//     res.send({firstName:'satish', lastName:'verma'});
// }, (req, res, next)=>{
//     console.log("this is second middleware");
//     res.send("this is second middleware");
// },(req, res, next)=>{
//     console.log("this is third middleware");
//     res.send("this is third middleware");
// },(req, res, next)=>{
//     console.log("this is fourth middleware");
//     res.send("this is fourth middleware");
// });

// app.listen(3000,()=>console.log("app is running on port 3000"));





// // ❌ ROUTE + ROUTE HANDLER (not middleware - specific to GET "/ab?c")
// app.get("/ab?c", (req, res)=>{
//     res.send({firstName:'satish', lastName:'verma'});
// });

// // ❌ ROUTE + ROUTE HANDLER (specific to GET "/user")
// app.get("/user", (req, res)=>{
//     res.send({firstName:'satish', lastName:'verma'});
// });

// // ❌ ROUTE + ROUTE HANDLER (specific to POST "/user")
// app.post("/user", (req, res)=>{
//     res.send("post user data successfully");
// });

// // ❌ ROUTE + ROUTE HANDLER (specific to DELETE "/user")
// app.delete("/user", (req, res)=>{
//     res.send("delete user data successfully");
// });

// // ✅ MIDDLEWARE (runs for ALL requests matching "/hello")
// app.use("/hello", (req, res)=>{
//     res.send("Hello from the server;")
// });

// // ✅ MIDDLEWARE (runs for ALL requests matching "/test")
// app.use('/test', (req, res)=>{
//     res.send("this is test");
// });

// // ✅ MIDDLEWARE (runs for ALL requests - catch-all)
// app.use('/', (req, res)=>{
//     res.send("/ route need to called at last because in we write at top then alway this will get hit and we wont see other routes")
// })











// ? means optional character, so it will match both /ac and /abc
// app.get("/ab?c", (req, res)=>{
//     res.send({firstName:'satish', lastName:'verma'});
// });

// app.get(/\/ab?c/, (req, res)=>{
//     res.send({firstName:'satish', lastName:'verma'});
// });

// app.get("/user", (req, res)=>{
//     res.send({firstName:'satish', lastName:'verma'});
// });
// app.post("/user", (req, res)=>{
//     res.send("post user data successfully");
// });
// app.delete("/user", (req, res)=>{
//     res.send("delete user data successfully");
// });
// app.use("/hello", (req, res)=>{
//     res.send("Hello from the server;")
// });
// app.use('/test', (req, res)=>{
//     res.send("this is test");
// });
// app.use('/', (req, res)=>{
//     res.send("/ route need to called at last because in we write at top then alway this will get hit and we wont see other routes")
// })