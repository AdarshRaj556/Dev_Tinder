const express=require("express");
const connectDB=require("./config/database");
const app=express();
port=7777;


connectDB()
.then(()=>{
        app.listen(port,()=>{
            console.log("server is listening at port 7777");
        });
    })
.catch((err)=>{
    console.error("something went wrong ",err);
})
