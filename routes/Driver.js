let express=require('express');
let route=express.Router();
let exe=require("./connection");
function validateDriver(req,res,next){
    req.session.did=1;
    if(req.session.did){
next();
    }
    else{
res.redirect("/driver/login");
    }
}
route.get("/login",async(req,res)=>{
    res.render("driver/login.ejs");
})
route.get("/",validateDriver,async(req,res)=>{
    let driver=await exe(`select*from driver_details where driver_details_id='${req.session.did}'`);
    let obj={
        "driver":driver[0]
    }
    
res.render("driver/index.ejs",obj);
})
route.post("/driver-login",async(req,res)=>{
    let d=await exe(`select*from driver_details where driver_mobile='${req.body.name}' and driver_password='${req.body.pass}'`);
    if(d.length!=0){
        req.session.did=d[0].driver_details_id;
        res.send("1")
    }
    else{
        res.send("0");
    }
})
route.get("/logout",validateDriver,async(req,res)=>{
    req.session.did=undefined;
    res.redirect("/driver");
})
route.get("/driver-profile",validateDriver,async(req,res)=>{
    let driver=await exe(`select*from driver_details where driver_details_id='${req.session.did}'`);
    let obj={
        "driver":driver[0]
    }
    res.render("driver/driverdetails.ejs",obj);
})
route.post("/update-driver/:id",async(req,res)=>{
    if(req.files){
     req.body.image=new Date().getTime()+req.files.img.name;
     req.files.img.mv("public/images/"+req.body.image);
     let d=req.body;
     let data=await exe(`update driver_details set driver_name='${d.driver_name}',driver_mobile='${d.driver_mobile}',driver_password='${d.driver_password}',driver_available_status='${d.driver_available_status}',driver_image='${d.image}' where driver_details_id='${req.params.id}'`);
   
    }
    else{
        let d=req.body;
        let data=await exe(`update driver_details set driver_name='${d.driver_name}',driver_mobile='${d.driver_mobile}',driver_password='${d.driver_password}',driver_available_status='${d.driver_available_status}' where driver_details_id='${req.params.id}'`);
      
    }
    res.redirect("/driver/driver-profile");
})
route.get("/delete-driver/:id",validateDriver,async(req,res)=>{
let d=await exe(`delete from driver_details where driver_details_id='${req.params.id}'`);
req.session.did=undefined;
res.redirect("/driver/login");
})
route.get("/task",validateDriver,async(req,res)=>{
    let driver=await exe(`select*from driver_details where driver_details_id='${req.session.did}'`);
    let d=await exe(`select*,(select number from vehical where vehical.id=order_det.vehical ) as v_num,(select driver_name from driver_details where driver_details.driver_details_id=order_det.driver) as driver_name from order_det where driver='${req.session.did}' and status='pending'`);
    let order=await exe(`select*,(select stock_name from stock where stock.stock_id=order_list.product) as product_name from order_list where order_id='${d[0].id}'`);

    let obj={
        "driver":driver[0],
        "data":d[0],
        "order":order
    }
    res.render("driver/task.ejs",obj);
})
module.exports=route;