const express=require("express");
const connectDB=require("./config/database");
const User=require("./models/user");
const app=express();
port=7777;

app.use(express.json());
app.post("/signup", async (req,res)=>{
    const user=new User(req.body);
    // console.log(user);
    // console.log(body);
    try{
        await user.save();
        res.send("user saved successfully");
    }catch(err){
        res.status(400).send("something went wrong "+ err);
    }
    // res.send("happy");
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
