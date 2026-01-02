const express=require("express");
const connectDB=require("./config/database");
const cookieParser=require('cookie-parser');
const app=express();

port=7777;

app.use(cookieParser());
app.use(express.json());

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");

app.use("/",authRouter,profileRouter,requestRouter,userRouter);

connectDB()
.then(()=>{
        app.listen(port,()=>{
            console.log("server is listening at port 7777");
        });
    })
.catch((err)=>{
    console.error("something went wrong ",err);
})
