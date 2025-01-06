let express=require('express');
let app=express();
let session=require('express-session');
let bodyparser=require('body-parser');
let driver=require('./routes/Driver');
app.use(express.static("public/"));
let upload=require('express-fileupload');
let master=require("./routes/master");
app.use(upload());
app.use(session({
    secret:'1234',
    resave:true,
    saveUninitialized:true
}));
app.use(bodyparser.urlencoded({extended:true}));
app.use("/",master);
app.use("/driver",driver);
app.listen(1000);  