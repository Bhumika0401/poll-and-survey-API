let loggedIn = false;


function openLogin(){

document.getElementById("loginModal").style.display="block";

}


async function login(){

const username = document.getElementById("username").value;

const password = document.getElementById("password").value;

const res = await fetch("/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({username,password})

});

const data = await res.json();

if(data.success){

alert("Login Successful");

loggedIn=true;

document.getElementById("loginModal").style.display="none";

}else{

alert("Wrong Login");

}

}


async function createPoll(){

if(!loggedIn){

alert("Please login first");

return;

}

const question = document.getElementById("question").value;

const options = [

document.getElementById("opt1").value,
document.getElementById("opt2").value,
document.getElementById("opt3").value

];


await fetch("/polls",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({question,options})

});


document.getElementById("question").value="";
document.getElementById("opt1").value="";
document.getElementById("opt2").value="";
document.getElementById("opt3").value="";


loadPolls();

}


async function loadPolls(){

const res = await fetch("/polls");

const polls = await res.json();

const container = document.getElementById("pollContainer");

container.innerHTML="";


polls.forEach(poll=>{

let div=document.createElement("div");

div.className="poll";


let html=`<h3>${poll.question}</h3>`;


poll.options.forEach((opt,i)=>{

html+=`<button onclick="vote(${poll.id},${i})">

${opt.text} (${opt.votes})

</button><br>`;

});


html+=`<canvas id="chart${poll.id}" width="300" height="200"></canvas>`;


div.innerHTML=html;

container.appendChild(div);

drawChart(poll);

});

}


async function vote(id,index){

await fetch(`/polls/${id}/vote`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({optionIndex:index})

});

loadPolls();

}


function drawChart(poll){

const ctx=document.getElementById(`chart${poll.id}`);

new Chart(ctx,{

type:"bar",

data:{
labels:poll.options.map(o=>o.text),
datasets:[{
label:"Votes",
data:poll.options.map(o=>o.votes)
}]
},

options:{
responsive:true,
maintainAspectRatio:false
}

});

}


loadPolls();