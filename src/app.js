const express = require("express");
const app = express();

app.use("/hello", (req, res)=>{
    res.send("Hello from the server;")
});
app.use('/test', (req, res)=>{
    res.send("this is test");
});
app.use('/', (req, res)=>{
    res.send("/ route need to called at last because in we write at top then alway this will get hit and we wont see other routes")
})
app.listen(3000,()=>console.log("app is running on port 3000"));