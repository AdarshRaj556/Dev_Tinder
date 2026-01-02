const express=require("express");
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest= require("../models/connectionRequest");
const userRouter=express.Router();
const User=require("../models/user");
const USER_SAFE_DATA=["firstName","lastName","photoUrl","about","skills","age","gender"];


userRouter.get("/user/requests/recieved",userAuth, async (req,res)=>{
    try{
        const loggedinUser=req.user;
        const data= await ConnectionRequest.find({toUserId:loggedinUser._id,status:"interested",
        }).populate("fromUserId",USER_SAFE_DATA);
        // console.log(data);
        res.json({message:"Data fetched Successfully",
            data
        });
    }catch(err){
        res.status(400).send("something went wrong "+err);
    }
})


userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedinUserId=req.user._id;
        const connectionRequest=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedinUserId,status:"accepted"},
                {fromUserId:loggedinUserId,status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);
        const data=[];
        for(const conn of connectionRequest){
            if(conn.toUserId.equals(loggedinUserId)){
                data.push(conn.fromUserId);
            }else{
                data.push(conn.toUserId);
            }
        }
        res.json({data}); 
    }catch(err){
        res.status(400).send("something went wrong "+err);
    }
})

userRouter.get("/feed",userAuth,async (req,res)=>{
    try{
        const loggedinUser=req.user;
        const connection=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedinUser._id},
                {fromUserId:loggedinUser._id}
            ]
        })
        console.log(connection);
        const hideUsers=new Set();
        for( let conn of connection){
            hideUsers.add(conn.fromUserId.toString());
            hideUsers.add(conn.toUserId.toString());
        }
        const hiddenIds = Array.from(hideUsers);
        const feedUsers = await User.find({
             _id: { $nin: hiddenIds }
        })
        .select(USER_SAFE_DATA)
        .limit(20);      
        res.json({
            user:feedUsers
        });

    }catch(err){
        res.status(400).send("something went wrong " + err);
    }
})



module.exports=userRouter;