const mongoose=require("mongoose");
const validator=require("validator");
const userSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true,
            minlength:3,
            maxlength:50,
        },
        lastName:{
            type:String,
            required:false,
            trim:true,
            minlength:3,
            maxlength:50,
        },
        age:{
            type:Number,
            min:18,
            max:120,
        },
        gender:{
            type:String,
            enum:["male","female","others"],

        },
        emailId:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            unique:true,
            validate:{
                validator(value){
                    if(validator.isEmail(value)){
                        return true;
                    }else{
                        return false;
                    }
                },
                message:"Invalid email format",
            }
        },
        password:{
            type:String,
            required:true,
            minlength:8,
        },
        photoUrl:{
            type:String,
            default:"https://img.icons8.com/?size=512w&id=bzulMXqKAC0I&format=png",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("PhotoUrl is not Url");
                }
            }
        },
        about:{
            type:String,
            default:"This is default about",
            maxlength:250,
        },
        skills:{
            type:[String],
            validate(value){
                if(value.length>10){
                    throw new Error("can't be more than 10 skills ");
                    return false;
                }else{
                    return true;
                }
            }
        }
    },
    {
        timestamps:true,
    }
)

const User=mongoose.model("User",userSchema);

module.exports=User;