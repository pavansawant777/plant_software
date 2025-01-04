let express=require('express');
let route=express.Router();
function validateAdmin(req,res,next){
req.session.mid=1;
    if(req.session.mid){
next();
}
else{
res.render('master/login.ejs');
}
}
route.get("/",validateAdmin,async(req,res)=>{
res.render("master/index.ejs");
});
route.get("/add-admin",validateAdmin,async(req,res)=>{
res.render("master/addadmin.ejs");
});
module.exports=route;