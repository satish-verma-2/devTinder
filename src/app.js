const express = require("express");
const app = express();

// app.get("/abc", (req, res)=>{
//     res.send({firstName:'satish', lastName:'verma'});
// }); 

// ? means optional character, so it will match both /ac and /abc
// app.get("/ab?c", (req, res)=>{
//     res.send({firstName:'satish', lastName:'verma'});
// });

app.get(/\/ab?c/, (req, res)=>{
    res.send({firstName:'satish', lastName:'verma'});
});

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
app.listen(3000,()=>console.log("app is running on port 3000"));