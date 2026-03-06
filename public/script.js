const API = "/polls";


// load polls
async function loadPolls(){

const res = await fetch(API);

const polls = await res.json();

const container = document.getElementById("pollContainer");

container.innerHTML = "";

polls.forEach(poll => {

let div = document.createElement("div");

div.className = "poll";

let html = `<h3>${poll.question}</h3>`;

poll.options.forEach((opt,index)=>{

html += `
<button onclick="vote(${poll.id},${index})">
${opt.text} (${opt.votes})
</button>
`;

});

div.innerHTML = html;

container.appendChild(div);

});

}


// create poll
async function createPoll(){

const question = document.getElementById("question").value;

const options = [

document.getElementById("opt1").value,
document.getElementById("opt2").value,
document.getElementById("opt3").value

];

await fetch(API,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({question,options})

});

loadPolls();

}


// vote
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


loadPolls();