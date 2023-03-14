

function showInvoice(){
        $("#newInvoice").animate({
            width: "toggle",
           
        });
}

function edit(ic){
    $("#newInvoice").animate({
        width:"toggle",
    });
    StreetAddress.value = JSON.parse(ic.senderAddress).street;
    City.value = JSON.parse(ic.senderAddress).city;
    PostCode.value = JSON.parse(ic.senderAddress).postCode;
    country.value = JSON.parse(ic.senderAddress).country;
    clientName.value = ic.clientName;
    ClientEmail.value = ic.clientEmail;
    ToStreetAddress.value = JSON.parse(ic.clientAddress).city;
    ToPostCode.value = JSON.parse(ic.clientAddress).postCode;
    ToCountry.value = JSON.parse(ic.clientAddress).country;
    ToCity.value = JSON.parse(ic.clientAddress).city;
    invoiceDate.value = ic.createdAt;
    if(PaymentsTerms.childNodes[1].value == ic.paymentTerms){
        PaymentsTerms.childNodes[1].selected = true;
    }
    else if(PaymentsTerms.childNodes[3].value == ic.paymentTerms){
        PaymentsTerms.childNodes[3].selected = true;
    }
    else if(PaymentsTerms.childNodes[5].value == ic.paymentTerms){
        PaymentsTerms.childNodes[5].selected = true;
    }
    else{
        PaymentsTerms.childNodes[7].selected = true;
    }
    projectDescription.value = ic.project;
    for (let i of JSON.parse(ic.itemName)){
        createNewItem();
        let ele =additionalDiv.lastElementChild.lastElementChild;
        ele.firstElementChild.value = i.name;
        ele.children[1].value = i.quantity;
        ele.children[2].value = i.price;
        ele.children[3].innerHTML = i.total;
    }
    document.getElementsByClassName("newInvoiceHeading")[0].innerText = "Edit#"+ic.id;

}

function deleteNode(){
    main.style.display = "flex";
}

function cancelDelete(){
    main.style.display = "none";
}

function deleteElement(b){
    console.log(b);
   fetch('/viewInvoice',{
    method:'POST',
    body: JSON.stringify({
       id:b,
    }),
    headers:{
        'Content-Type' : 'application/json; charset=utf-8',
    },
    redirect:"follow",

   }).then((response)=>{
    window.location.href="/index2";
    return response;
   });
   let r = document.getElementsByClassName("l")[0].innerText;
   document.getElementsByClassName("l")[0].innerText = Number(r) - 1;
}

function markPaid(a){
    console.log(a)
    fetch("/markpaid",{
        method:"POST",
        body:JSON.stringify({
            id : a,
        }),
        headers:{
            'Content-Type' : 'application/json;  Charset=utf-8',
        },
        redirect:"follow",
    }).then((response)=>{
        window.location.reload();
        return response;
    })
}



function discardInvoice(){
     newInvoice.style.display = "none";
     let arr = ["StreetAddress","City","PostCode","country","clientName","ClientEmail","ToStreetAddress","ToCity","ToCountry","ToPostCode","invoiceDate","PaymentsTerms","projectDescription"];
     for(let i of arr){
        document.getElementById(i).value = "";
     }
     document.getElementsByClassName("additional")[0]?.remove();
}


function draftInvoice(sta,i){
    if(this.location == "http://localhost:5083/index2"){
    let itemsValue  = generateItems();
    let idValue = randomID();
    let date = new Date(invoiceDate.value);
    date.setDate(date.getDate()+Number(PaymentsTerms.value));
fetch("/data",{
    method:"POST",
    body:JSON.stringify({
        id: idValue,
        createdAt : invoiceDate.value ,
        paymentDue : date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
        decription : projectDescription.value,
        paymentTerms:Number(PaymentsTerms.value),
        clientName :clientName.value,
        clientEmail : ClientEmail.value,
        status : sta ,
        senderAddress : {
            street: StreetAddress.value,
            city:City.value,
            postCode:PostCode.value,
            country:country.value,
        },
        clientAddress : {
            street:ToStreetAddress.value,
            city:ToCity.value,
            postCode:ToPostCode.value,
            country:ToCountry.value,
        },
        items:itemsValue[0],
        total: 100,
    }),
    headers:{
        'Content-Type' : 'application/json;  Charset=utf-8',
    },
    redirect:"follow",
}).then((response)=>{
    window.location.reload();
    return response;
})
let arr = ["StreetAddress","City","PostCode","country","clientName","ClientEmail","ToStreetAddress","ToCity","ToCountry","ToPostCode","invoiceDate","PaymentsTerms","projectDescription"];
for(let i of arr){
   document.getElementById(i).value = "";
}
document.getElementsByClassName("additional")[0]?.remove(); 
let r = document.getElementsByClassName("l")[0].innerText;
   document.getElementsByClassName("l")[0].innerText = Number(r) + 1;
    }else{
        editInvoice(sta,i);
    }
}

function editInvoice(sta,i){
    let s = document.getElementsByClassName("content1");
    let ele = s[0].firstElementChild.firstElementChild.textContent.split("#")[1];
    let itemsValue = generateItems();
    console.log(projectDescription.value);
    fetch("/editInvoice",{
        method:"POST",
        headers:{
            'Content-type':'application/json; Charset=utf-8',
        },
        body:JSON.stringify({
            createdAt : invoiceDate.value ,
            paymentTerms:Number(PaymentsTerms.value),
            description : projectDescription.value,
            senderAddress : {
                street: StreetAddress.value,
                city:City.value,
                postCode:PostCode.value,
                country:country.value,
            },
            clientAddress : {
                street:ToStreetAddress.value,
                city:ToCity.value,
                postCode:ToPostCode.value,
                country:ToCountry.value,
            },
            clientName :clientName.value,
            clientEmail : ClientEmail.value,
            items:itemsValue[0],
            total:itemsValue[1],
            id : ele,
            table:i,
            status:sta,
        }),
        redirect:"follow",
    }).then((response)=>{
        window.location.reload();
        return response;
    })
}


function generateItems(){
    let ele = document.getElementsByClassName("additional");
    let array = [];
    let t = 0;
    for (let i of ele){
        array.push({
            name:i.childNodes[1].childNodes[0].value,
            quantity:Number(i.childNodes[1].childNodes[2].value),
            price:  Number(i.childNodes[1].childNodes[4].value),
            total:Number(i.childNodes[1].childNodes[6].innerText),
        })
       t+=Number(i.childNodes[1].childNodes[6].innerText);
    }
  return [array,t];
}


function randomID(){
            let randomArray = "1234567890QWERTYUIOPASDFHJKLZXCVBNM";
            randomArray = randomArray.split("");
            let variable = "";
            for (let i = 0 ;i < 6 ;i++)
            {
                variable+=randomArray[Math.floor(Math.random()*36)];
            }
            console.log(variable)
            return variable;
}

function showTotal(i){
    console.log(i.parentElement.childNodes)
    i.parentElement.childNodes[6].innerText = i.parentElement.childNodes[2].value*i.parentElement.childNodes[4].value;
}

function trash(i){
    i.parentElement.parentElement.remove();
}

function showFilter(){
  if (filter.classList == "block"){
   filter.style.display = "block";
   filter.classList.remove("block");
  }
  else{
    filter.style.display = "none";
    filter.classList.add("block");
  }
}

function filteredDiv(status,checked){
    let parentElements = document.getElementsByClassName(status);
    let dis = "";
    let count = 0;
    (checked)?dis = "grid" : dis = "none";
    for (let i of parentElements){
       i.parentElement.style.display = dis;
       count++;
    }
   let r = document.getElementsByClassName("l")[0].innerText;
   if (dis == "none"){
    document.getElementsByClassName("l")[0].innerText = Number(r) - count;
   }
   else{
    document.getElementsByClassName("l")[0].innerText = Number(r)+count;
   }
    
}

///create a new Item when creating new Invoice


function createNewItem(){

let main = document.createElement("div");
main.classList.add("additional");
let a = document.createElement("p");
a.classList.add("newInvoiceHead3");
a.innerHTML = `<span>Item Name</span>
     <span>Qty.</span>
    <span>Price</span>
     <span>Total</span>`
main.append(a);
let f = document.createElement("div");
f.classList.add("newInvoiceHead3");
f.classList.add("height");
main.append(f);

f.innerHTML = `<input id='ItemName' onclick='storeValue(this.value)' class='width' value='' type = 'text' />
    <input onchange='showTotal(this)' id='quantity' class='width' type = 'text' />
    <input onchange='showTotal(this)' id='Price' class='width' type = 'text' />
    <div id ='itemTotal'></div>
    <i onclick="trash(this)" class="fa-solid fa-trash trash trashPin"></i>`
additionalDiv.append(main);
}


function themeChange(){
    fetch("/theme",{
        method :"POST",
        redirect:"follow"
    })
    .then((response)=>{
        window.location.reload();
        return response;
    })
}


