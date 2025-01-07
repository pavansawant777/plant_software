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
    var driver = await exe( `select count(*) as ttl from driver_details`)
    var stock = await exe(`select count(*) as ttl_stk from stock `)
    var vehical = await exe(`select count(*) as ttl_vehical from vehical`)
    var vd = await exe(`select count(*) as ttlvd from order_det`)
    var vdp = await exe(`select count(*) as ttlp from order_det where status='pending' `)
    var vda = await exe(`select count(*) as ttla from order_det where status='completed' `)
   
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    let obj={
    "admin": user[0],
    "driver":driver[0],
    "stock":stock[0],
    "vehical":vehical[0],
    "vd":vd[0],
    "vdp":vdp[0],
    "vda":vda[0],
    
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
                                              driver_image,
                                              salary)
                                              VALUES(
                                              '${d.driver_name}',
                                              '${d.driver_mobile}',
                                              '${d.driver_address}',
                                              '${d.driver_available_status}',
                                              '${d.driver_password}',
                                              '${d.driver_image}',
                                              '${d.driver_payment}')`;
        
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
                                              driver_image='${d.driver_image}',
                                              salary='${d.driver_payment}' WHERE driver_details_id = '${d.driver_details_id}'`;
        var data = await exe(sql)
        res.redirect("/driver_list");
        }
        else{
        var d =req.body
        var sql = `UPDATE driver_details SET driver_name='${d.driver_name}',
                                              driver_mobile='${d.driver_mobile}',
                                              driver_address='${d.driver_address}',
                                              driver_available_status='${d.driver_available_status}',
                                              driver_password='${d.driver_password}'
                                              ,
                                              salary='${d.driver_payment}' WHERE driver_details_id = '${d.driver_details_id}'`
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
route.get("/add-vehical",validateAdmin,async(req,res)=>{
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    let obj={
        "admin":user[0]
    }
    res.render("master/addvehical.ejs",obj);
})
route.post("/save-vehical",async(req,res)=>{
req.body.image=new Date().getTime()+req.files.img.name;
req.files.img.mv("public/images/"+req.body.image);
let d=req.body;
let data=await exe(`insert into vehical(name,number,image,isAvilable) values('${d.name}','${d.number}','${d.image}','${'true'}')`);
res.redirect("/vehical-list");
})
route.get("/vehical-list",validateAdmin,async(req,res)=>{
    let d=await exe(`select*from vehical`);
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    let obj={
        "admin":user[0],
        "vehi":d
    }
res.render("master/vehilist.ejs",obj);
})
route.get("/edit-vehical/:id",validateAdmin,async(req,res)=>{
    let d=await exe(`select*from vehical where id='${req.params.id}'`);
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    let obj={
        "admin":user[0],
        "vehi":d[0]
    }
    res.render("master/vehidetails.ejs",obj);
})
route.post("/update-car/:id",async(req,res)=>{
    if(req.files){
     req.body.image=new Date().getTime()+req.files.img.name;
     req.files.img.mv("public/images/"+req.body.image);
     let d=req.body;
     let data=await exe(`update vehical set name='${d.name}',number='${d.number}',image='${d.image}',isAvilable='${d.isAvilable}' where id='${req.params.id}'`);




    }
    else{
 let d=req.body;
     let data=await exe(`update vehical set name='${d.name}',number='${d.number}',isAvilable='${d.isAvilable}' where id='${req.params.id}'`);
    }
    res.redirect("/edit-vehical/"+req.params.id);
})
route.get("/delete-vehical/:id",validateAdmin,async(req,res)=>{
let d=await exe(`delete from vehical where id='${req.params.id}'`)
res.redirect("/vehical-list");
})
route.get("/add_stock",validateAdmin,async function(req,res){

    let user=await exe(`select*from admin where id='${req.session.mid}'`);

     let obj={
         
         "admin":user[0]
     }
     res.render("master/add_stock.ejs",obj)
 })

 route.post("/save_stock",async function(req,res){
     var d = req.body

     var sql = `insert into stock(stock_name,stock_qty,stock_unit,stock_date)values(?,?,?,?)`

     var data = await exe(sql,[d.stock_name,d.stock_qty,d.stock_unit,d.stock_date])

     // res.send(data)
     res.redirect("/add_stock")
 })

 route.get("/stock_list",validateAdmin,async function(req,res){
     let user=await exe(`select*from admin where id='${req.session.mid}'`);

     var sql =  `select*from stock`
     var data = await exe(sql)

     var obj = {"stock":data,"admin":user[0]}
     
     res.render("master/stock_list.ejs",obj)
 })

 route.get("/edit_stock/:id",validateAdmin,async function(req,res){
     let user=await exe(`select*from admin where id='${req.session.mid}'`);

     var sql =`select*from stock where stock_id  = '${req.params.id}'`

     var data = await exe(sql)

     var obj ={"data":data[0],"admin":user[0]}
     res.render("master/edit_stock.ejs",obj)
 })

 route.post("/update_stock",async function(req,res){
     var d = req.body
     var sql = `update stock set stock_name = '${d.stock_name}', stock_qty = '${d.stock_qty}',stock_unit = '${d.stock_unit}',stock_date='${d.stock_date}' where stock_id = '${d.stock_id}'`
     
     var data = await exe(sql)

     // res.send(data)
     res.redirect("/stock_list")

 })

 route.get("/delete_stock/:id",async function(req,res){

     var data =await exe(`delete from stock where stock_id = '${req.params.id}'`)

     // res.redirect("/stock_list")
     res.redirect("/stock_list")

 })
 route.get("/add-delivery",validateAdmin,async(req,res)=>{
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    let stock=await exe(`select*from stock where stock_qty>0`);
    let driver=await exe(`select*from driver_details where driver_available_status='true'`);
    var obj ={"admin":user[0],
        "product":stock,
        "driver":driver
    }
    res.render("master/adddeli.ejs",obj);
 })


route.get("/add_stock",validateAdmin,async function(req,res){

    let user=await exe(`select*from admin where id='${req.session.mid}'`);

     let obj={
         
         "admin":user[0]
     }
     res.render("master/add_stock.ejs",obj)
 })

 route.post("/save_stock",async function(req,res){
     var d = req.body

     var sql = `insert into stock(stock_name,stock_qty,stock_unit,stock_date)values(?,?,?,?)`

     var data = await exe(sql,[d.stock_name,d.stock_qty,d.stock_unit,d.stock_date])

     // res.send(data)
     res.redirect("/add_stock")
 })

 route.get("/stock_list",validateAdmin,async function(req,res){
     let user=await exe(`select*from admin where id='${req.session.mid}'`);

     var sql =  `select*from stock`
     var data = await exe(sql)

     var obj = {"stock":data,"admin":user[0]}
     
     res.render("master/stock_list.ejs",obj)
 })

 route.get("/edit_stock/:id",validateAdmin,async function(req,res){
     let user=await exe(`select*from admin where id='${req.session.mid}'`);

     var sql =`select*from stock where stock_id  = '${req.params.id}'`

     var data = await exe(sql)

     var obj ={"data":data[0],"admin":user[0]}
     res.render("master/edit_stock.ejs",obj)
 })

 route.post("/update_stock",async function(req,res){
     var d = req.body
     var sql = `update stock set stock_name = '${d.stock_name}', stock_qty = '${d.stock_qty}',stock_unit = '${d.stock_unit}',stock_date='${d.stock_date}' where stock_id = '${d.stock_id}'`
     
     var data = await exe(sql)

     // res.send(data)
     res.redirect("/stock_list")

 })

 route.get("/delete_stock/:id",async function(req,res){

     var data =await exe(`delete from stock where stock_id = '${req.params.id}'`)

     // res.redirect("/stock_list")
     res.send("<script>confirm('Are you Sure');location.href=document.referrer;</script>")

 })
 
 route.post("/save-delivery",async(req,res)=>{
    let update_drive=await exe(`update driver_details set driver_available_status='false' where driver_details_id='${req.body.driver}'`);
    let oderdet=await exe(`insert into order_det(order_date,driver,address,status) values('${req.body.order_date}','${req.body.driver}','${req.body.address}','pending')`);
    for(let i=0;i<req.body.product.length;i++){
         let sto=await exe(`select*from stock where stock_id='${req.body.product[i]}'`);
         let update_sto=await exe(`update stock set stock_qty='${sto[0].stock_qty-req.body.qty[i]}'`);
        let d=await exe(`insert into order_list(product,qty,order_id) values('${req.body.product[i]}','${req.body.qty[i]}','${oderdet.insertId}')`);

    }
    res.send("1");
   
})
route.get("/delivery-list",validateAdmin,async(req,res)=>{
    let d=await exe(`select*,(select number from vehical where vehical.id=order_det.vehical ) as v_num,(select driver_name from driver_details where driver_details.driver_details_id=order_det.driver) as driver_name from order_det `);
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    var obj ={"data":d,"admin":user[0]}
    res.render("master/deliverylist.ejs",obj);
})
route.post("/update-oder-address/:id",async(req,res)=>{
    let d=await exe(`update order_det set address='${req.body.address}' where id='${req.params.id}'`);
    res.send("done");
})
route.get("/order-list/:id",validateAdmin,async(req,res)=>{
 let d=await exe(`select*,(select stock_name from stock where stock.stock_id=order_list.product) as product_name from order_list where order_id='${req.params.id}'`);
    let user=await exe(`select*from admin where id='${req.session.mid}'`);
    var obj ={"data":d,"admin":user[0]}
    res.render("master/oderlist.ejs",obj);
})
module.exports=route;