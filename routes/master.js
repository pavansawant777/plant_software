let express=require('express');
let route=express.Router();
let mysql=require('mysql');
let exe=require('./connection')
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
   let d=await exe(`select*from admin where contact='${req.body.name}' and password='${req.body.pass}'`);
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





route.get("/add_driver",validateAdmin,async (req,res)=>
    {
        let user=await exe(`select*from admin where id='${req.session.mid}'`);
   
        let obj={
            
            "admin":user[0]
        }
        res.render("master/add_driver.ejs",obj)
    });
    
    route.post("/save_driver_details",async (req,res)=>
    {
        req.body.driver_image = new Date().getTime() + req.files.driver_image.name;
        req.files.driver_image.mv("public/images/"+req.body.driver_image);
        var d = req.body
        
        var sql = `INSERT INTO driver_details(driver_name,
                                              driver_mobile,
                                              driver_address,
                                              driver_available_status,
                                              driver_password,
                                              driver_image)
                                              VALUES(
                                              '${d.driver_name}',
                                              '${d.driver_mobile}',
                                              '${d.driver_address}',
                                              '${d.driver_available_status}',
                                              '${d.driver_password}',
                                              '${d.driver_image}')`;
        
        var data = await exe(sql);
    
        res.redirect("/driver_list")
    });
    
    route.get("/driver_list", validateAdmin,async (req,res)=>
    {
        var sql = `SELECT * FROM driver_details`
        var data = await exe(sql);
        let user=await exe(`select*from admin where id='${req.session.mid}'`);
        var obj = {"driver_det":data,"admin":user[0]}
        res.render("master/driver_list.ejs",obj)
    });
    
    
    route.get("/edit_driver_details/:driver_details_id",validateAdmin, async(req,res)=>
    {
        var id = req.params.driver_details_id;
        var sql = `SELECT * FROM driver_details WHERE driver_details_id = '${id}'`;
        var data = await exe(sql);
        let user=await exe(`select*from admin where id='${req.session.mid}'`);
        var obj = {"driver_det":data[0],"admin":user[0]}
        res.render("master/edit_driver_details.ejs", obj);
    });
    
    route.post("/update_driver_details", async (req,res)=>
    {
        if(req.files){
        req.body.driver_image = new Date().getTime() + req.files.driver_image.name;
        req.files.driver_image.mv("public/images/"+req.body.driver_image);
        var d =req.body
        var sql = `UPDATE driver_details SET driver_name='${d.driver_name}',
                                              driver_mobile='${d.driver_mobile}',
                                              driver_address='${d.driver_address}',
                                              driver_available_status='${d.driver_available_status}',
                                              driver_password='${d.driver_password}',
                                              driver_image='${d.driver_image}' WHERE driver_details_id = '${d.driver_details_id}'`;
        var data = await exe(sql)
        res.redirect("/driver_list");
        }
        else{
        var d =req.body
        var sql = `UPDATE driver_details SET driver_name='${d.driver_name}',
                                              driver_mobile='${d.driver_mobile}',
                                              driver_address='${d.driver_address}',
                                              driver_available_status='${d.driver_available_status}',
                                              driver_password='${d.driver_password}' WHERE driver_details_id = '${d.driver_details_id}'`
        var data = await exe(sql)
        res.redirect("/driver_list") 
        }
    });
    
    
    route.get("/delete_driver_details/:driver_details_id",validateAdmin,async (req,res)=>
    {
        var id = req.params.driver_details_id;
        var sql = `DELETE FROM driver_details WHERE driver_details_id = '${id}'`
        var data = await exe(sql);
        res.redirect("/driver_list");
    });

module.exports=route;