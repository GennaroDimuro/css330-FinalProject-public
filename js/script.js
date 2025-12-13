'use strict';

const ADMIN_GOOGLE_ID = "1234567890abcdef";

const currentGoogleId = "1234567890abcdef";

async function fetchTasks() {
    const BASE_URL = "https://css330-finalproject.onrender.com/tasksinfo";

    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();
        return data.tasks || [];

    } catch (err) {
        console.error("Error fetching tasks:", err);
        return [];
    }
}

async function renderTasks() {
    const jobsContainer = document.getElementById("jobsContainer");
    const tasksContainer = document.getElementById("tasksContainer");

    if (!jobsContainer && !tasksContainer) {
        return;
    }
    
    const tasks = await fetchTasks();

    if (jobsContainer) {
        tasks.forEach(task => {
            jobsContainer.appendChild(createJobCard(task));
        });
    }

    if (tasksContainer) {
        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <p id="no-tasks-message" class="has-text-centered mt-5 subtitle is-5">
                    No tasks assigned yet
                </p>`;
            return;
        }

        tasks.forEach(task => {
            tasksContainer.appendChild(addCardTask(task));
        });
    }
}

function createJobCard(task) {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
        <div class="job-header">
            <h3 class="job-title">${task.title}</h3>
            <span class="job-company">${task.issued}</span>
        </div>
        <div class="job-body">
            <p><strong>Location:</strong> ${task.location}</p>
            <p><strong>Due Date:</strong> ${task.deadline}</p>
            <p><strong>Description:</strong> ${task.description}</p>
        </div>
        <div class="job-footer">
            <button class="apply-btn">Register</button>
        </div>
    `;

    card.querySelector(".apply-btn").addEventListener("click", () => {
        alert(`You registered for the job: ${task.title}`);
    });

    return card;
}

function addTask() {
    let Tasktitle = document.querySelector("#title").value;
    let TaskIssuedBy = document.querySelector("#issuedby").value;
    let TaskLocation = document.querySelector("#location").value;

    let TaskSalary = document.querySelector("#salary").value;
    let TaskAmount = document.querySelector("#amount").value;

    let FullSalary = TaskSalary + TaskAmount;

    let TaskVoluntary = document.querySelector("#voluntary").value;
    let TaskDescription = document.querySelector("#description").value;

    let TaskDate = document.querySelector("#date").value;
    let TaskTime = document.querySelector("#time").value;

    let Taskdeadline = TaskDate + " " + TaskTime;

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
        salary: FullSalary,
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

    Task_addition_db(Tasktitle, TaskIssuedBy, TaskLocation, FullSalary, TaskVoluntary, TaskDescription, Taskdeadline);
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
        <span class="task-issued">Issued by: ${task.issued}</span>
        <span class="task-members">
            Members:
            <select class="members-select">
                ${membersOptions}
            </select>
        </span>
        <span class="task-date">Date: ${task.deadline.slice(0, 10)}</span>
        <span class="task-time">Time: ${task.deadline.slice(11, 16)}</span>
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

async function Task_addition_db(title, issued, location, salary, voluntary, description, deadline) {
    const BASE_URL = "https://css330-finalproject.onrender.com/tasks";
    
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title,
                issued,
                location,
                salary,
                voluntary,
                description,
                deadline
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (err) {
        console.error("Error adding task:", err);
    }
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

            const msgContainer = document.getElementById("msg-box");
            if (container.children.length === 0) {
                msgContainer.innerHTML = `
                <p id="no-tasks-message" class="has-text-centered mt-5 subtitle is-5">
                No users registered
                </p>`;
            }


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

    const userIdToDelete = user.id;
    deleteUserApi(userIdToDelete);
    if (card) {
        card.remove();
    }

    const usersContainer = document.getElementById("usersContainer");
    const msgContainer = document.getElementById("msg-box");
        if (usersContainer.children.length === 0) {
            msgContainer.innerHTML =`
                <p id="no-tasks-message" class="has-text-centered mt-5 subtitle is-5">
                    No users registered
                </p>`;
        }
  });

  return card;
}

async function deleteUserApi(userId) {
    const url = `https://css330-finalproject.onrender.com/users/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            alert(`User ${userId} deleted successfully from database.`);
        } else {
            const errorData = await response.json();
            alert(`Failed to delete user: ${errorData.error}`);
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        alert('A network error occurred.');
    }
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
    fetchTasks();

    const taskContainer = document.getElementById("tasksContainer");

    if (taskContainer) {
        if (taskContainer.children.length === 0) {
            taskContainer.innerHTML = `
                <p id="no-tasks-message" class="has-text-centered mt-5 subtitle is-5">
                    No tasks assigned yet
                </p>`;
        }
    }

    addTaskTest('Develop API', 'TechCorp', 'Low', '2025-12-15');
    addTaskTest('Design UI', 'Designify', 'Medium', '2025-12-20');

};