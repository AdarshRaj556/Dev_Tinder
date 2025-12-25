const express=require("express");

const app=express();
port=7777;

app.use("/user/:id",(req,res,next)=>{
    try{
        if(req.params.id==="101"){
            res.send("hello user");
        }else{
            throw new Error("not valid userid");
        }
    }catch(err){
        next(err);
    }
})

app.use("/",(err,req,res,next)=>{
    res.status(404).send("userid not found");
})
app.listen(port,()=>{
    console.log("server is listening");
})

