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

const users = [
  {
    name: "Alice Johnson",
    photo: "files/profile.jpg",
    email: "alice@example.com",
    googleId: "alice123",
    description: "Frontend developer"
  },
  {
    name: "Bob Smith",
    photo: "files/profile.jpg",
    email: "bob@example.com",
    googleId: "bob456",
    description: "Backend engineer"
  }
];

const tasks = [
  { id: 1, title: "Develop API", issuedBy: "TechCorp", members: ["Alice", "Bob", "Charlie"]},
  { id: 2, title: "Design UI", issuedBy: "Designify", members: ["Diana", "Eve"]}
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

function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";

  const membersOptions = task.members.map(member => 
    `<option value="${member}">${member}</option>`
  ).join("");


  card.innerHTML = `
    <div class="task-info">
        <span class="task-title">Task: ${task.title}</span>
        <span class="task-issued">Issued by: ${task.issuedBy}</span>
        <span class="task-members">
            Members:
            <select class="members-select">
                ${membersOptions}
            </select>
        </span>

    </div>

    <div class="buttons">
        <button type="submit" class="button is-warning is-outlined">
            <span>Edit</span>
            <span class="icon is-small">
                <i class="fa-solid fa-pen"></i>
            </span>
        </button>
        <button type="submit" class="delete-btn">
            <span>Delete</span>
            <span class="icon is-small">
                <i class="fas fa-times"></i>
            </span>
        </button>
    </div>
  `;
  return card;
}

function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "user-card";

  card.innerHTML = `
    <div class="user-header">
      <div class="user-profile">
        <img src="${user.photo}" alt="${user.name}" class="user-photo">
        <h3 class="user-name">${user.name}</h3>
      </div>
      <button class="delete-user-btn" title="Delete User"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="user-body">
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Google ID:</strong> ${user.googleId}</p>
      <p><strong>Description:</strong> ${user.description}</p>
    </div>
  `;

  card.querySelector(".delete-user-btn").addEventListener("click", () => {
    alert(`User ${user.name} deleted`);
    card.remove();
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
        if (!tbody) return;
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

    const UserCont = document.getElementById("usersContainer");
    if (UserCont) {
        users.forEach(user => {
            const card = createUserCard(user);
            UserCont.appendChild(card);
        });
    }

    const taskContainer = document.getElementById("tasksContainer");

    if (taskContainer) {
        if (tasks.length === 0) {
            taskContainer.innerHTML = `<p class="has-text-centered mt-5 subtitle is-5">No tasks assigned yet</p>`;
        } else {
            tasks.forEach(task => {
            const card = createTaskCard(task);
            taskContainer.appendChild(card);
            });
        }
    }

    addTask('Develop API', 'TechCorp', 'Low', '2025-12-15');
    addTask('Design UI', 'Designify', 'Medium', '2025-12-20');

};