const User= require("../models/user");
const jwt=require("jsonwebtoken");
const adminaAuth=(req,res,next)=>{
    let token="xya";
    if(token=="xyz"){
        // res.send("admin is autorised");
        next();
    }else{
        res.status(401).send("give correct credential");
    }
};
const userAuth= async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("invalid token");
        }
        const message=await jwt.verify(token,"Dev@Tinder$234");
        const {_id}=message;
        const user= await User.findById(_id);
        if(!user){
            throw new Error("Not found");
        }
        req.user=user;
        next();
    }catch(err){
        res.status(400).send("Authentication issue "+err);
    }
}
module.exports={adminaAuth,userAuth};