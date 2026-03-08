let loggedIn = false;
let chartInstances = {}; // Track charts by poll ID

function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
        loggedIn = true;
        document.getElementById("loginModal").style.display = "none";
        alert("Welcome, Admin!");
    } else {
        alert("Invalid Credentials");
    }
}

async function createPoll() {
    if (!loggedIn) return alert("Please login to create polls.");

    const question = document.getElementById("question").value;
    const options = [
        document.getElementById("opt1").value,
        document.getElementById("opt2").value,
        document.getElementById("opt3").value
    ].filter(opt => opt.trim() !== "");

    if (!question || options.length < 2) return alert("Enter a question and at least 2 options.");

    await fetch("/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options })
    });

    ["question", "opt1", "opt2", "opt3"].forEach(id => document.getElementById(id).value = "");
    loadPolls();
}

async function loadPolls() {
    const res = await fetch("/polls");
    const polls = await res.json();
    const container = document.getElementById("pollContainer");
    container.innerHTML = "";

    polls.forEach(poll => {
        const div = document.createElement("div");
        div.className = "poll";
        const canvasId = `chart-${poll.id}`;

        div.innerHTML = `
            <h3>${poll.question}</h3>
            <div class="poll-options-grid">
                ${poll.options.map((opt, i) => `
                    <button onclick="vote(${poll.id}, ${i})">
                        ${opt.text} <br> <strong>${opt.votes} votes</strong>
                    </button>
                `).join('')}
            </div>
            <div class="chart-container">
                <canvas id="${canvasId}"></canvas>
            </div>
        `;
        container.appendChild(div);
        
        // Short delay to ensure DOM is ready
        setTimeout(() => renderChart(poll, canvasId), 50);
    });
}

async function vote(id, index) {
    await fetch(`/polls/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: index })
    });
    loadPolls();
}

function renderChart(poll, canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Cleanup old instance to prevent collision
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: poll.options.map(o => o.text),
            datasets: [{
                data: poll.options.map(o => o.votes),
                backgroundColor: ['#10b981', '#8b5cf6', '#f59e0b'],
                borderRadius: 8,
                barThickness: 20
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bars are cleaner
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            }
        }
    });
}

loadPolls();