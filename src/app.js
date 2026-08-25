const express = require("express");
const app = express();

app.use("/user", (req, res, next)=>{
    console.log("this is second middleware");
    next();
    res.send({firstName:'satish', lastName:'verma'});
}, (req, res, next)=>{
    console.log("this is second middleware");
    res.send("this is second middleware");
},(req, res, next)=>{
    console.log("this is third middleware");
    res.send("this is third middleware");
},(req, res, next)=>{
    console.log("this is fourth middleware");
    res.send("this is fourth middleware");
});











app.listen(3000,()=>console.log("app is running on port 3000"));





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