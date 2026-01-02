const mongoose=require("mongoose");


const connectionRequestSchema=mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        },
        status:{
            type:String,
            enum:{
                values:["accepted","rejected","ignored","interested"],
                message:`{VALUE} is incorrect status type`
            },
        },
    },
    {
        timestamps:true,
    }
);

connectionRequestSchema.index({fromUserId:1,toUserId:1});


//better practice but check this at top is more benificial
// connectionRequestSchema.pre("save", function (next) {
//     if (this.fromUserId.equals(this.toUserId)) {
//         return next(new Error("You can't send a request to yourself"));
//     }
//     next();
// });


const ConnectionRequest=new mongoose.model("connectionRequest",connectionRequestSchema);


module.exports=ConnectionRequest;