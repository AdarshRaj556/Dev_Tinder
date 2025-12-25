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
app.get("/user/:id", async (req,res)=>{
    // console.log(req.body);
    try{
        const {id}=req.params
        const user=await User.findById(id);
        if(!user){
            res.status(404).send("user not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.send("something went wrong "+err);
    }
})
app.get("/user", async (req,res)=>{
    // console.log(req.body);
    try{
        const users=await User.find({firstName : req.body.firstName});
        if(users.length===0){
            res.status(404).send("No user found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.send("something went wrong "+err);
    }
})
app.get("/feed",async (req,res)=>{
    try{
        const users=await User.find({});
        if(users.length===0){
            res.status(404).send("No user found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.send("something went wrong "+err);
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
