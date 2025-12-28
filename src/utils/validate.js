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

module.exports=validateSignup;