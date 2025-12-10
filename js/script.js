'use strict';

const jobs = [
    {
        title: "Backend Developer",
        company: "TechCorp",
        priority: "High",
        dueDate: "15/12/2025",
        description: "Develop APIs with Flask and SQLAlchemy."
    },
    {
        title: "UI Designer",
        company: "Designify",
        priority: "Medium",
        dueDate: "20/12/2025",
        description: "Design clean interfaces using Bulma."
    }
];

const ADMIN_GOOGLE_ID = "1234567890abcdef";

const currentGoogleId = "1234567890abcdef";

function createJobCard(job) {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
        <div class="job-header">
            <h3 class="job-title">${job.title}</h3>
            <span class="job-company">${job.company}</span>
        </div>
        <div class="job-body">
            <p><strong>Priority:</strong> ${job.priority}</p>
            <p><strong>Due Date:</strong> ${job.dueDate}</p>
            <p><strong>Description:</strong> ${job.description}</p>
        </div>
        <div class="job-footer">
            <button class="apply-btn">Register</button>
        </div>
    `;

    card.querySelector(".apply-btn").addEventListener("click", () => {
        alert(`You registered for the job: ${job.title}`);
    });

    return card;
}

function isAdmin() {
    if (currentGoogleId === ADMIN_GOOGLE_ID) {
        const navList = document.getElementById("navList");
        if (!navList) return;

        const li = document.createElement("li");
        li.innerHTML = `<a class="admin-link" href="/BetterBlock/admin.html">Administration</a>`;
        navList.appendChild(li);
    }
};

function selectAll() {
    const checkboxes = document.querySelectorAll('#taskList input[type="checkbox"]');
    const icon = document.getElementById('checkMark');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => cb.checked = !allChecked);

    if (allChecked) {
        icon.classList.remove('fa-square-check');
        icon.classList.add('fa-square');
    } else {
        icon.classList.remove('fa-square');
        icon.classList.add('fa-square-check');
    }
}

function deleteSelected() {
    const rows = document.querySelectorAll('#taskList tr');
    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            row.remove();
        }
    });
}

function addTask(task, assigned, priority, dueDate) {
        const tbody = document.getElementById('taskList');
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${task}</td>
            <td>${assigned}</td>
            <td>${priority}</td>
            <td>${dueDate}</td>
        `;
        tbody.appendChild(tr);
    }

function loginWithGoogle() {
    const backendUrl = "http://127.0.0.1:5000/auth/login";

    window.location.href = backendUrl;
}

window.onload = function() {
    console.log("La página cargó completamente.");
    isAdmin();

    const container = document.getElementById("jobsContainer");
    if (container) {
        jobs.forEach(job => {
            const card = createJobCard(job);
            container.appendChild(card);
        });
    }

    addTask('Develop API', 'TechCorp', 'Low', '2025-12-15');
    addTask('Design UI', 'Designify', 'Medium', '2025-12-20');

};