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
