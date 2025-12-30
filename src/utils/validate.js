const validator=require('validator');

const validateSignup=(req)=>{
    const {firstName,lastName,password,emailId}=req.body;
    if(!firstName || !lastName){
        throw new Error("Give full Name");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong password");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Not a valid email Id ");
    }
}

const validateIfUpatable=function (req){
    const allowedUpdates=["firstName","lastName","photoUrl","age","skills","about","gender"];
    for(let key in req.body){
        let flag=0;
        for(let i=0;i<allowedUpdates.length;i++){
            if(key===allowedUpdates[i]){
                flag=1;
            }
        }
        if(flag==0){
            return false;
        }
    }
    return true;
}

module.exports={validateSignup,validateIfUpatable};