const express=require("express");
const connectDB=require("./config/database");
const User=require("./models/user");
const app=express();
port=7777;

app.post("/signup", async (req,res)=>{
    let body="";
    // let date_now=Date.now();
    req.on("data", chunk => {
        body += chunk.toString();
    });
    req.on("end",async ()=>{
        console.log(body);
        const data=JSON.parse(body);
        const  user=new User(data);
        console.log(data);
        await user.save()
        // console.log(Date.now()-date_now);
    })
    // console.log(user);
    // console.log(body);
    // try{
    //     await user.save();
    //     res.send("user saved successfully");
    // }catch(err){
    //     res.status(400).send("something went wrong "+ err);
    // }
    res.send("happy");
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
