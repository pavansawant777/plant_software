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
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    let obj={
    "admin": user[0]
   }
res.render("master/index.ejs",obj);
});

route.get("/add-admin",validateAdmin,async(req,res)=>{
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    let obj={
    "admin": user[0]
   }
res.render("master/addadmin.ejs",obj);
});
route.post("/save-admin",validateAdmin,async(req,res)=>{
    req.body.image=new Date().getTime()+req.files.img.name;
    req.files.img.mv("public/images/"+req.body.image);
let d=await exe(`insert into admin(name,contact,image,password) values('${req.body.name}','${req.body.number}','${req.body.image}','${req.body.pass}')`);
res.redirect("/add-admin");
})
route.get("/admin-list",validateAdmin,async(req,res)=>{
    let d=await exe('select*from admin');
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
   
    let obj={
        "data":d,
        "admin":user[0]
    }
    res.render("master/adminlist.ejs",obj);
})



route.post("/admin-login",async(req,res)=>{
   let d=await exe(`select*from admin where contact='${req.body.number}' and password='${req.body.pass}'`);
   if(d.length!=0){
    req.session.mid=d[0].id;
  res.send("1");
   }else{
   res.send("0");
   }
})
route.get("/admin-profile",validateAdmin,async(req,res)=>{
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
   
    let obj={
        
        "admin":user[0]
    }
    res.render("master/admindetails.ejs",obj);
})
route.post("/update-admin/:id",async(req,res)=>{
if(req.files){
req.body.image=new Date().getTime()+req.files.img.name;
req.files.img.mv("public/images/"+req.body.image);
let d=await exe(`update admin set name='${req.body.name}',contact='${req.body.number}',image='${req.body.image}',password='${req.body.pass}' where id='${req.params.id}'`);
}
else{
    let d=await exe(`update admin set name='${req.body.name}',contact='${req.body.number}',password='${req.body.pass}' where id='${req.params.id}'`);

}

res.redirect("/admin-profile");
})
route.get("/logout",validateAdmin,async(req,res)=>{
    req.session.mid=undefined;
    res.redirect("/");
})
route.get("/delete-admin/:id",validateAdmin,async(req,res)=>{
let d=await exe(`delete from admin where id='${req.params.id}'`);
req.session.mid=undefined;
res.redirect("/");
})

route.post("/admin-login",validateAdmin,async(req,res)=>{
    res.send(req.body);

})
module.exports=route;