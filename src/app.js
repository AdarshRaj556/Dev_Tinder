const express=require("express");
const connectDB=require("./config/database");
const User=require("./models/user");
const app=express();
port=7777;

app.post("/signup", async (req,res)=>{
    const user=new User({
        firstName:"saloni",
        lastName:"kumari",
        gender:"female",
        emailId:"saloni&gmail.com",
        password:"saloni123",
        age:17
    })
    try{
        await user.save();
        res.send("user saved successfully");
    }catch(err){
        res.status(400).send("something went wrong "+ err);
    }
})

connectDB()
.then(()=>{
        app.listen(port,()=>{
            console.log("server is listening at port 7777");
        });
    })
.catch((err)=>{
    console.error("something went wrong ",err);
})
