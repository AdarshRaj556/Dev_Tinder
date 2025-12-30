const express=require('express');
const validateSignup=require('../utils/validate');
const bcrypt=require('bcrypt');
const User=require("../models/user");

const authRouter=express.Router();

authRouter.post("/signup", async (req,res)=>{
    // console.log(user);
    // console.log(body);
    try{
        validateSignup(req);
        const {firstName,lastName,password,emailId}=req.body;
        const passwordHash= await bcrypt.hash(password,10);
        const data={
            firstName,
            lastName,
            password:passwordHash,
            emailId
        }
        const user=new User(data);
        await user.save();
        res.send("user saved successfully");
    }catch(err){
        res.status(400).send("something went wrong "+ err);
    }
    // res.send("happy");
});


authRouter.post("/login", async (req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Incorrect credentials");
        }
        const isValidPassword= user.validatePassword(password);
        if(isValidPassword){
            const token= user.getJWT();
            res.cookie("token",token,{expires: new Date(Date.now()+ 60*60*1000*24)});
            res.send("login successful");
        }else{
            throw new Error("Incorrect crendentials");
        }
    }catch(err){
        res.status(400).send("something went wrong "+ err);
    }
});

module.exports=authRouter;