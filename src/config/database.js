const mongoose=require("mongoose");

async function connectDB() {
    try{
        await mongoose.connect("mongodb+srv://adarshraj_db_user:2j2QHbk8z2MzJrii@adarshraj.ejkiky3.mongodb.net/devTinder");
        console.log("connected to database successfully");
    }catch(err){
        console.error("connection failed to database",err);
        throw err;
    }
}
module.exports=connectDB;