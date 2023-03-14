
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const port = 5087;
const database = require('mysql');
const data = require('./data.json');
const ls = require('local-storage');
const { render } = require('ejs');
const { json } = require('body-parser');
ls("theme","light");







let databaseLength = data.length;
let index = 0;
let ic = 0;
let connection = database.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database:'Invoice'
});
let arr = Object.keys(data[0]);
        let value = [];
        let values =[];
        let num = 0 ;
        for (let i of data){
            for(let j = 0 ; j < arr.length ; j++){
                if (j == 0) {value.push(num)};
                if(j < 8 || j > 10 ){
                value.push((i[arr[j]]));
                }
                else{
                     let a = i[arr[j]];
                    value.push(JSON.stringify(a));
                }
            }
            values.push(value); 
            value = [];
            num++;
        }


let jsonData;
connection.connect((err)=>{
       if (err){
          console.log(err);
       }
       else{
        // let sql = "DROP TABLE Data";
        // let sql = `INSERT INTO Data (TableName,${arr[0]},${arr[1]},${arr[2]},${arr[3]},${arr[4]},${arr[5]},${arr[6]},${arr[7]},${arr[8]},${arr[9]},${arr[10]},${arr[11]}) values ?`;
        // let sql = `CREATE TABLE Data(TableName varchar(10),${arr[0]} varchar(10),${arr[1]} varchar(50),${arr[2]} varchar(50), ${arr[3]} varchar(30), ${arr[4]} int, ${arr[5]} varchar(30), ${arr[6]} varchar(30),${arr[7]} varchar(30), ${arr[8]} JSON,${arr[9]} JSON,${arr[10]} JSON,${arr[11]} DECIMAL(20,2))`;
           let sql = "SELECT * FROM Data";
        connection.query(sql,[values],function(err,respond){
            if(err!=null)
            {
                console.log(err);
            }
           jsonData = respond;
         })
       }
    });
   

    
app.set("view engine","ejs");
let urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(bodyParser.json()); 
app.use(express.static("public"));



app.get('/',(req,res)=>{
    res.end("hello");
});

app.get("/index2",(req,res)=>{
    sql = "SELECT * FROM Data";
    connection.query(sql,function(err,respond){
        if(err!=null)
        {
            console.log(err);
        }
        // console.log(respond);
       jsonData = respond;
    })
    let months = ["","Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
    if(ls.get("theme") == "light"){
        css = "css/style2.css";
    }
    else{
        css = "css/style1.css";
    }
    let ic  = jsonData[1];
    res.render("index2",{months,ic,jsonData,css});
})

app.post("/viewInvoice",urlencodedParser,(req,res)=>{
    console.log("hellol");
    console.log(req.body.id);
    index = req.body.id;
    sql = "DELETE FROM `Data` WHERE TableName = '"+index+"'";
    console.log(index)
    connection.query(sql,function(err,respond){
       if (err!=null){
        console.log(err);
       }
   });
   res.redirect("/index2")
});

app.get('/viewInvoice',(req,res)=>{
 if (req.query.id < jsonData.length && jsonData[req.query.id].TableName == req.query.id){
    ic = jsonData[req.query.id];
 }
   else { 
        for(let i = 0 ; i < jsonData.length;i++){
            if (jsonData[i].TableName == req.query.id){
                ic = jsonData[i] ;
                break;
            }
        }
    }
    if (ls.get("theme") == "light"){
       css = "css/Details.css";
    }
    else{
        console.log("css")
        css = "css/Details1.css";
    }
    res.render("Details",{jsonData,ic,css});
})

app.post("/markpaid",urlencodedParser,(req,res)=>{
    sql = "UPDATE `Data` SET `status` = 'paid' WHERE `TableName` = '"+req.body.id+"' ";
    connection.query(sql,function(err,respond){
        if (err != null){
            console.log(err);
        }
    });
    sql = "SELECT * FROM Data";
    connection.query(sql,function(err,respond){
        if(err != null){
           console.log(err);
        }
        jsonData = respond;
    })
    res.redirect("/viewInvoice?id="+req.body.id+"");
})

app.post("/data",urlencodedParser,(req,res)=>{
    let a = req.body // dummy variable assign for write easily
    let val = [[databaseLength,a.id,a.createdAt,a.paymentDue,a.decription,a.paymentTerms,a.clientName,a.clientEmail,a.status,JSON.stringify(a.senderAddress),JSON.stringify(a.clientAddress),JSON.stringify(a.items),a.total]]
    databaseLength++
    sql = `INSERT INTO Data (TableName,${arr[0]},${arr[1]},${arr[2]},${arr[3]},${arr[4]},${arr[5]},${arr[6]},${arr[7]},${arr[8]},${arr[9]},${arr[10]},${arr[11]}) values ?`
    connection.query(sql,[val],function(err,respond){
        if (err != null){
            console.log(err);
        }
    });
    console.log(val);
    res.redirect("/index2")
})

app.post("/editInvoice",urlencodedParser,(req,res)=>{
    let a = req.body;
    sql = "UPDATE `Data` SET `createdAt` = '"+a.createdAt+"',`paymentTerms` = '"+a.paymentTerms+"',`senderAddress` = '"+JSON.stringify(a.senderAddress)+"',`clientAddress` = '"+JSON.stringify(a.clientAddress)+"',`description` = '"+a.description+"',`total` = '"+a.total+"',`clientName` = '"+a.clientName+"',`clientEmail` = '"+a.clientEmail+"',`items` = '"+JSON.stringify(a.items)+"'WHERE `id` = '"+a.id+"'";
    connection.query(sql,function(err,respond){
        if (err != null){
            console.log(err);
        }
        console.log(respond);
    });
    sql = "SELECT * FROM Data";
    connection.query(sql,function(err,respond){
        if(err != null){
           console.log(err);
        }
        jsonData = respond;
    })
    res.redirect("viewInvoice?id="+a.table)
})

app.post("/theme",urlencodedParser,(req,res)=>{
    if(ls.get("theme") == "light"){
        ls("theme","dark");
        res.redirect("/index2");
    }else{
        ls("theme","light");
        res.redirect("/index2");
    }
})



app.listen(port,() => console.log("listening",port));
  
