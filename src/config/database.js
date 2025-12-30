const mongoose=require("mongoose");
const {MONGODBCONNECTIONSTRING}=require("../secret_keys");
async function connectDB() {
    try{
        await mongoose.connect(MONGODBCONNECTIONSTRING);
        console.log("connected to database successfully");
    }catch(err){
        console.error("connection failed to database",err);
        throw err;
    }
}
module.exports=connectDB;