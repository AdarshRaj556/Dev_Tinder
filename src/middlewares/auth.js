const adminaAuth=(req,res,next)=>{
    let token="xya";
    if(token=="xyz"){
        // res.send("admin is autorised");
        next();
    }else{
        res.status(401).send("give correct credential");
    }
};
module.exports={adminaAuth};