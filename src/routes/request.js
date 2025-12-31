const express=require("express");
const validator=require('validator');
const User=require("../models/user");
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const requestRouter=express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
    try{
        const user=req.user;
        const status=req.params.status;
        const toUserId=req.params.toUserId;
        const fromUserId=user._id;
        if(fromUserId.equals(toUserId)){ //we can use pre function also (implemented already)
            throw new Error("you can't send request to yourself");
        }
        const toUser=await User.findById(toUserId);
        if(!toUser){
            throw new Error("No user with this user Id");
        }
        if(status!="interested" && status!="ignored"){
            throw new Error("Not valid status");
        }
        const isRequestSentAlready1= await ConnectionRequest.findOne({toUserId,fromUserId});
        const isRequestSentAlready2= await ConnectionRequest.findOne({toUserId:fromUserId,fromUserId:toUserId});
        if(isRequestSentAlready1 || isRequestSentAlready2){
            throw new Error("Request Sent already");
        }
        const data={
            toUserId,fromUserId,status
        }
        const connectionRequest=new ConnectionRequest(data);
        await connectionRequest.save();
        res.json({
            message:
            status === "interested"
                ? `Request sent successfully to ${toUser.firstName}`
                : `You have ignored ${toUser.firstName}`,
            data
        });

    }catch(err){
        res.status(400).send("something went wrong " +err);
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{
    try{
        const {status,requestId}=req.params;
        const loggedInUserId=req.user._id;
        if(status!="accepted" && status!="rejected"){
            return res.status(400).json({message:"Status not allowed"});
        }
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUserId,
            status:"interested"
        })
        if(!connectionRequest){
            return res.status(400).json({message:"conneciton request not found"});
        }
        connectionRequest.status=status;
        const data=await connectionRequest.save();
        res.json({
            message:"connection request"+status,
            data
        }) 
        
    }catch(err){
        res.status(400).send("something went wrong " +err);

    }
})



module.exports=requestRouter;