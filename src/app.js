const express=require("express");

const app=express();
port=7777;

app.use("/",(req,res)=>{
    res.send("hello adarsh"); //ordering matter if this is at the top most route...route below never get chance to execute.
})

app.use("/test",(req,res)=>{
    res.send("hello world");
})
app.use("/hi",(req,res)=>{
    res.send("hi hi hi");
})
app.listen(port,()=>{
    console.log("server is listening");
})

