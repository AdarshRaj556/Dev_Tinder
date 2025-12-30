const express=require("express");
const validator=require('validator');
const User=require("../models/user");
const {userAuth}=require("../middlewares/auth");
const requestRouter=express.Router();

requestRouter.post("/sendconnectionrequest/:emailId",userAuth,async (req,res)=>{
    try{
        const user=req.user;
        const email=req.params?.emailId;
        if(!validator.isEmail(email)){
            throw new Error("not a email id");
        }
        const friend= await User.findOne({emailId:email});
        if(!email){
            throw new Error("email is required field");
        }
        if(email==user.emailId){
            throw new Error("you can not send email to yourself");
        }
        if(!friend){
            throw new Error("No user found with this email id");
        }
        res.send(user.firstName +" sent a friend request to "+ friend.firstName);
    }catch(err){
        res.status(400).send("something went wrong " +err);
    }
});


module.exports=requestRouter;