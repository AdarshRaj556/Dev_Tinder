const express=require("express");
const {userAuth}=require("../middlewares/auth");
const bcrypt=require("bcrypt");
const profileRouter=express.Router();
const {validateIfUpatable}= require("../utils/validate");
const validator=require("validator");
profileRouter.get("/profile/veiw",userAuth,async (req,res)=>{
    try{
        const user=req.user;
        res.send(user);

    }catch(err){
        res.status(400).send("something went wrong "+err);
    }
});

profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{
    try{
        const isEditable=validateIfUpatable(req);
        if(!isEditable){
            throw new Error("Some fields can't be editted");
        }
        const user=req.user;
        for(let key in req.body){
            user[key]=req.body[key];
        }
        await user.save();
        res.json({
            message:`${user.firstName},your profile is updated successfully`, 
            data:user,
        });
    }catch(err){
        res.status(400).send("something went wrong "+err);
    }
});

profileRouter.patch("/profile/changePassword",userAuth, async(req,res)=>{
    try{
        const {oldPassword,newPassword}=req.body;
        if(!oldPassword){
            throw new Error("Give old password");
        }
        if(!newPassword){
            throw new Error("give new password");
        }
        if(oldPassword===newPassword){
            throw new Error("Password should be differnt");
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Give strong password");
        }
        const user=req.user;
        const isOldPasswordCorrect=await bcrypt.compare(oldPassword,user.password);
        if(!isOldPasswordCorrect){
            throw new Error("give correct password");
        }
        const newPasswordHash=await bcrypt.hash(newPassword,10);
        user.password=newPasswordHash;
        await user.save();
        res.cookie("token",null, {expires: new Date(Date.now())});
        res.send("password changed successfully");
    }catch(err){
        res.status(400).send("something went wrong "+err);
    }
})

module.exports=profileRouter