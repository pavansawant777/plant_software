let express=require('express');
let route=express.Router();
route.get("/",async(req,res)=>{
res.render("master/index.ejs");
});
module.exports=route;