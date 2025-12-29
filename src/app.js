const express=require("express");
const connectDB=require("./config/database");
const User=require("./models/user");
const bcrypt=require('bcrypt');
const validator=require('validator');
const validateSignup=require('./utils/validate');
const cookieParser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const {userAuth}= require("./middlewares/auth");
const app=express();
port=7777;

    //.                            * implementation of cookie parser*
// function cookieParser(req){
//     const str=req.headers?.cookie;
//     if(!str) return {};
//     const cookie={};
//     let key="",value="";
//     let flag=0;
//     for(let i=0;i<str.length;i++){
//         if(str[i]==' ')continue;
//         if(str[i]==';'){
//             cookie[key]=decodeURIComponent(value);
//             key="",value="";
//             flag=0;
//             continue;
//         }
//         if(str[i]=="="){
//             flag=1;
//             continue;
//         }
//         if(flag==0){
//             key+=str[i];
//         }else{
//             value+=str[i];
//         }
//     }

//     if(key.length!=0){
//         cookie[key]=decodeURIComponent(value);
//     }
//     return cookie
// }

// app.use((req,res,next)=>{
//     req.cookies=cookieParser(req);
//     next();
// });



app.use(cookieParser());
app.use(express.json());
app.post("/signup", async (req,res)=>{
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
})

app.post("/login", async (req,res)=>{
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
})

app.post("/sendconnectionrequest/:emailId",userAuth,async (req,res)=>{
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
})
app.get("/profile",userAuth,async (req,res)=>{
    try{
        const {token}=(req.cookies);
        // console.log(typeof(req));
        // console.log(res);
        if(!token){
            throw new Error("Go back to login page");
        }
        const decodedMessage= await jwt.verify(token,"Dev@Tinder$234");
        const {_id}=decodedMessage;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("user not found");
        }
        // console.log(user);
        res.send(user);

    }catch(err){
        res.send("something went wrong "+err);
    }
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
        const users=await User.find({emailId : req.body.emailId});
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

app.patch("/user/:userId", async (req,res)=>{
    try{
        const userId=req.params?.userId;
        const allowedUpdates=["age","about","photoUrl","password", "skills","gender"];
        const data=req.body;
        for (let key in data){
            let flag=0;
            for(let i=0;i<allowedUpdates.length;i++){
                if(key==allowedUpdates[i]){
                    flag=1;
                    break;
                }
            }
            if(flag==0){
                throw new Error("non editable");
            }
        }
        // const data=req.body.data;   nothing is req.data 
        console.log(userId);
        // console.log(req.body);
        // console.log(data);
        const user= await User.findByIdAndUpdate({_id:userId},req.body,{returnDocument:"after",runValidators:true});
        console.log(user);
        if(!user){
            res.status(404).send("user not found");
        }else{
            res.send("succesful");
        }
    }catch(err){
        res.send("something went wrong "+err);
    }
})

// app.patch("/user",async (req,res)=>{
//     try{
//         const email=req.body.emailId;
//         const user = await User.findOne({ emailId: email });
//         if(!user){
//             res.status(404).send("user not found");
//         }else{
//             res.send("succesful");
//         }

//     }catch(err){
//         res.send("something went wrong "+err);
//     }
// })
app.delete("/user", async (req,res)=>{
    try{
        const email=req.body.emailId;

        const user=await User.deleteOne({emailId:email});
        console.log(user);
        if(!user){
            res.status(404).send("user not found");
        }else{
            // console.log(user);
            res.send("user deletd successfully");
        }
    }catch(err){
        res.send("something went wrong"+ err);
    }
})

app.delete("/user", async (req,res)=>{
    try{
        const userId=req.body.userId;
        // console.log(userId);
        const user= await  User.findByIdAndDelete(userId);
        console.log(user);
        if(!user){
            res.status(404).send("user not found");
        }else{
            // console.log(user);
            res.send("user deletd successfully");
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
