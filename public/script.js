let loggedIn = false;
let chartInstances = {};

checkLogin();

// LOGIN MODAL 

function openLogin(){
    document.getElementById("loginModal").style.display="flex";
}


// CHECK LOGIN 

function checkLogin(){

    const user = JSON.parse(localStorage.getItem("user"));

    if(user){
        loggedIn = true;

        const userDisplay = document.getElementById("userDisplay");

        if(userDisplay){
            userDisplay.innerText = "Hello, " + user.username;
        }

    }else{
        loggedIn = false;
    }

}


// LOGIN 

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

        const user = {
            id: data.userId,
            username: username,
            role: data.role
        };

        localStorage.setItem("user", JSON.stringify(user));

        loggedIn = true;

        document.getElementById("loginModal").style.display="none";

        alert("Login successful");

        loadPolls();

    }else{
        alert("Invalid credentials");
    }

}

//REGISTER 

async function register(){

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username,
            password
        })
    });

    const data = await res.json();

    if(data.success){
        alert("User registered successfully");
    }else{
        alert("Registration failed");
    }

}


/* -------------------- LOGOUT -------------------- */

function logout(){

    localStorage.removeItem("user");

    loggedIn = false;

    alert("Logged out");

    location.reload();

}


/* -------------------- CREATE POLL -------------------- */



/* -------------------- LOAD POLLS -------------------- */

async function loadPolls(){

    const res = await fetch("/polls");

    const polls = await res.json();

    const container = document.getElementById("pollContainer");

    container.innerHTML="";

    polls.forEach(poll=>{

        const div=document.createElement("div");

        div.className="poll";

        const canvasId=`chart-${poll.id}`;

        div.innerHTML=`

        <h3>${poll.question}</h3>

        <div class="poll-options-grid">

        ${poll.options.map((opt,i)=>`

        <button onclick="vote(${poll.id},${i})">

        ${opt.text}

        <br>

        <strong>${opt.votes} votes</strong>

        </button>

        `).join("")}

        </div>

        <div class="chart-container">

        <canvas id="${canvasId}"></canvas>

        </div>
        `;

        container.appendChild(div);

        setTimeout(()=>renderChart(poll,canvasId),50);

    });

}


/* -------------------- VOTE -------------------- */

async function vote(id, index){

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
        alert("Login first");
        return;
    }

    const res = await fetch(`/polls/${id}/vote`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            optionIndex:index,
            userId:user.id
        })
    });

    const data = await res.json();

    if(!data.success){
        alert(data.message);
    }

    loadPolls();

}


/* -------------------- CHART -------------------- */

function renderChart(poll,canvasId){

    const ctx=document.getElementById(canvasId);

    if(!ctx) return;

    if(chartInstances[canvasId]){
        chartInstances[canvasId].destroy();
    }

    chartInstances[canvasId]=new Chart(ctx,{

        type:"bar",

        data:{
            labels:poll.options.map(o=>o.text),

            datasets:[{
                data:poll.options.map(o=>o.votes),
                backgroundColor:["#10b981","#8b5cf6","#f59e0b"],
                borderRadius:8
            }]
        },

        options:{
            indexAxis:"y",
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{display:false}
            }
        }

    });

}
async function createPoll(){

    if(!loggedIn){
        alert("Login first");
        return;
    }

    const question=document.getElementById("question").value;

    const options=[
        document.getElementById("opt1").value,
        document.getElementById("opt2").value,
        document.getElementById("opt3").value
    ].filter(o=>o.trim()!="");


    if(!question || options.length<2){
        alert("Enter question and at least 2 options");
        return;
    }

    await fetch("/polls",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            question,
            options
        })
    });


    document.getElementById("question").value="";
    document.getElementById("opt1").value="";
    document.getElementById("opt2").value="";
    document.getElementById("opt3").value="";

    loadPolls();

}


loadPolls();