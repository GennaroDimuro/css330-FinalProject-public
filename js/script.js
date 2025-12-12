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

function addTask() {
    let Tasktitle = document.querySelector("#title").value;
    let TaskIssuedBy = document.querySelector("#issuedby").value;
    let TaskLocation = document.querySelector("#location").value;

    let TaskSalary = document.querySelector("#salary").value;
    let TaskAmount = document.querySelector("#amount").value;

    let TaskVoluntary = document.querySelector("#voluntary").value;
    let TaskDescription = document.querySelector("#description").value;

    let TaskDate = document.querySelector("#date").value;
    let TaskTime = document.querySelector("#time").value;

    let alertT = document.querySelector("#alertEmptyTask");
    let alertI = document.querySelector("#alertEmptyIssuedBy");
    let alertV = document.querySelector("#alertEmptyVoluntary");
    let alertD = document.querySelector("#alertEmptyDate");
    let alertTi = document.querySelector("#alertEmptyTime");

    alertT.style.display = "none";
    alertI.style.display = "none";
    alertV.style.display = "none";
    alertD.style.display = "none";
    alertTi.style.display = "none";

    let valid = true;

    if (Tasktitle === "") {
        alertT.className = "help is-danger";
        alertT.style.display = "block";
        valid = false;
    } else {
        alertT.className = "help";
        alertT.style.display = "none";
    }

    if (TaskIssuedBy === "") {
        alertI.className = "help is-danger";
        alertI.style.display = "block";
        valid = false;
    } else {
        alertI.className = "help";
        alertI.style.display = "none";
    }

    if (TaskVoluntary === "") {
        alertV.className = "help is-danger";
        alertV.style.display = "block";
        valid = false;
    } else {
        alertV.className = "help";
        alertV.style.display = "none";
    }

    if (TaskDate === "") {
        alertD.className = "help is-danger";
        alertD.style.display = "block";
        valid = false;
    } else {
        alertD.className = "help";
        alertD.style.display = "none";
    }

    if (TaskTime === "") {
        alertTi.className = "help is-danger";
        alertTi.style.display = "block";
        valid = false;
    } else {
        alertTi.className = "help";
        alertTi.style.display = "none";
    }

    if (!valid) return;

    const task = {
        title: Tasktitle,
        issuedBy: TaskIssuedBy,
        location: TaskLocation,
        salary: TaskSalary + TaskAmount,
        voluntary: TaskVoluntary,
        description: TaskDescription,
        date: TaskDate,
        time: TaskTime,
        members: ["None"]
    };
    
    const card = addCardTask(task);
    const parent = document.getElementById("tasksContainer");

    const msg = document.getElementById("no-tasks-message");
    if (msg) msg.remove();

    parent.appendChild(card);

    document.getElementById("adminForm").reset();
    document.getElementById("dateForm").reset();
}

function addCardTask(task) {
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
        <span class="task-date">Date: ${task.date}</span>
        <span class="task-time">Time: ${task.time}</span>
    </div>

    <div class="buttons">
        <button type="submit" class="button is-warning is-outlined">
            <span>Edit</span>
            <span class="icon is-small">
                <i class="fa-solid fa-pen"></i>
            </span>
        </button>
        <button type="submit" class="delete-task-btn">
            <span>Delete</span>
            <span class="icon is-small">
                <i class="fas fa-times"></i>
            </span>
        </button>
    </div>
  `;

    card.querySelector(".delete-task-btn").addEventListener("click", () => {
        card.remove();

        const taskContainer = document.getElementById("tasksContainer");
        if (taskContainer.children.length === 0) {
            taskContainer.innerHTML =`
                <p id="no-tasks-message" class="has-text-centered mt-5 subtitle is-5">
                    No tasks assigned yet
                </p>`;
        }
    });

  return card;
}

async function fetchUsers() {
    const BASE_URL = "https://css330-finalproject.onrender.com/google";
    try {
        const response = await fetch(BASE_URL);
        if (response.ok) {
            const data = await response.json();

            const users = data.users || [];
            const container = document.getElementById('usersContainer');
            if (!container) return;


            users.forEach(user => {
            const card = createUserCard(user);
            container.appendChild(card);
            });


            return data;
        } else {
            console.error("Failed to fetch users");
            return { users: [] };
        }
    } catch (err) {
        console.error('Error fetching users:', err);
        return { users: [] };
    }
}

function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "user-card";

  card.innerHTML = `
    <div class="user-header">
      <div class="user-profile">
        <img src="${user.profile_pic}" alt="${user.name}" class="user-photo">
        <h3 class="user-name">${user.name}</h3>
      </div>
      <button class="delete-user-btn" title="Delete User"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="user-body">
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Google ID:</strong> ${user.google_id}</p>
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

function addTaskTest(task, assigned, priority, dueDate) {
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
    const backendUrl = "https://css330-finalproject.onrender.com/auth/login";

    window.location.href = backendUrl;
}

window.onload = function() {
    isAdmin();
    fetchUsers();

    const taskContainer = document.getElementById("tasksContainer");

    if (taskContainer) {
        if (taskContainer.children.length === 0) {
            taskContainer.innerHTML = `
                <p id="no-tasks-message" class="has-text-centered mt-5 subtitle is-5">
                    No tasks assigned yet
                </p>`;
        }
    }

    const container = document.getElementById("jobsContainer");
    if (container) {
        jobs.forEach(job => {
            const card = createJobCard(job);
            container.appendChild(card);
        });
    }

    addTaskTest('Develop API', 'TechCorp', 'Low', '2025-12-15');
    addTaskTest('Design UI', 'Designify', 'Medium', '2025-12-20');

};