const express=require("express");

const app=express();
port=7777;


//regex
app.get(/ab?c/,(req,res)=>{ //ac or abc
    res.send("get using regex");
})

app.get(/ab*c/,(req,res)=>{
    res.send("abbbbcddedd");
})
app.get("/user",(req,res)=>{
    // res.send({"name":"adarsh raj","age":"19"});
    console.log(req.query);
    res.send("hi"+req.query.name);
})
// defining dynamic route 
app.get("/product/:name/:id",(req,res)=>{
    console.log(req.params.name);
    res.send(req.params);
})
app.post("/user",(req,res)=>{
    console.log("data sent successfully");
    res.send("post request recieved");
})
app.put("/user",(req,res)=>{
    let user=req.query;
    console.log(user);
    res.send(user);
})

app.listen(port,()=>{
    console.log("server is listening");
})

