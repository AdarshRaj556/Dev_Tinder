const express=require("express");

const app=express();
port=7777;

app.get("/test",(req,res)=>{
    res.send("hello world");
})
app.get("/hi",(req,res)=>{
    res.send("hi hi hi");
})
app.listen(port,()=>{
    console.log("server is listening");
})