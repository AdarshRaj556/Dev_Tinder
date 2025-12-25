const express=require("express");

const app=express();
port=7777;

const {adminaAuth}=require("./middlewares/auth");

app.use("/admin",adminaAuth);
app.use("/admin/getalldata",(req,res,next)=>{
    res.send("all data sent");
})




app.listen(port,()=>{
    console.log("server is listening");
})

