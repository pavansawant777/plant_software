let express=require('express');
let route=express.Router();
let mysql=require('mysql');
let exe=require('./connection')
function validateAdmin(req,res,next){

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
route.post("/save-admin",validateAdmin,async(req,res)=>{
    req.body.image=new Date().getTime()+req.files.img.name;
    req.files.img.mv("public/images/"+req.body.image);
let d=await exe(`insert into admin(name,contact,image,password) values('${req.body.name}','${req.body.number}','${req.body.image}','${req.body.pass}')`);
res.redirect("/add-admin");
})
route.get("/admin-list",validateAdmin,async(req,res)=>{
    let d=await exe('select*from admin');
    let obj={
        "data":d
    }
    res.render("master/adminlist.ejs",obj);
})
route.post("/admin-login",validateAdmin,async(req,res)=>{
    res.send(req.body);
})
module.exports=route;