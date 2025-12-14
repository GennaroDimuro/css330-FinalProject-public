'use strict';

const ADMIN_GOOGLE_ID_1 = "111636469482706576725";
const ADMIN_GOOGLE_ID_2 = "101847123791874334760";


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
        jobsContainer.innerHTML = "";
        tasks.forEach(task => {
            jobsContainer.appendChild(createJobCard(task));
        });
    }

    if (tasksContainer) {
        tasksContainer.innerHTML = "";
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
            <span class="job-company">${task.organization}</span>
        </div>
        <div class="job-body">
            <p><strong>Location:</strong> ${task.location}</p>
            <p><strong>Voluntary:</strong> ${task.voluntary}</p>
            <p><strong>Age Requirement:</strong> ${task.age}</p>
            <p><strong>Date:</strong> ${task.date} ${task.time.slice(0, 5)}</p>
            <p><strong>Description:</strong> ${task.description}</p>
        </div>
        <div class="job-footer">
            <p id="counter" class="counter-msg">counter: 0</p>
            <button type="button" class="apply-btn" onclick="registerTask">Register</button>
        </div>
    `;

    card.querySelector(".apply-btn").addEventListener("click", () => {
        alert(`You registered for the job: ${task.title}`);
    });

    return card;
}

async function addTask() {
    const form = document.getElementById("adminForm");
    const editingId = form.dataset.editingId;

    let Tasktitle = document.querySelector("#title").value;
    let TaskOrganization = document.querySelector("#organization").value;
    let TaskLocation = document.querySelector("#location").value;
    let TaskVoluntary = document.querySelector("#voluntary").value;
    let TaskAge = document.querySelector("#age").value;
    let TaskDescription = document.querySelector("#description").value;

    let TaskDate = document.querySelector("#date").value;
    let TaskTime = document.querySelector("#time").value;

    let alertT = document.querySelector("#alertEmptyTask");
    let alertO = document.querySelector("#alertEmptyOrganization");
    let alertL = document.querySelector("#alertEmptyLocation");
    let alertD = document.querySelector("#alertEmptyDate");
    let alertTi = document.querySelector("#alertEmptyTime");

    alertT.style.display = "none";
    alertO.style.display = "none";
    alertL.style.display = "none";
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

    if (TaskOrganization === "") {
        alertO.className = "help is-danger";
        alertO.style.display = "block";
        valid = false;
    } else {
        alertO.className = "help";
        alertO.style.display = "none";
    }

    if (TaskLocation === "") {
        alertL.className = "help is-danger";
        alertL.style.display = "block";
        valid = false;
    } else {
        alertL.className = "help";
        alertL.style.display = "none";
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

    let CreatedTask = {
        title: Tasktitle,
        organization: TaskOrganization,
        location: TaskLocation,
        voluntary: TaskVoluntary,
        age: TaskAge,
        description: TaskDescription,
        date: TaskDate,
        time: TaskTime,
    };

    if (editingId) {
        await updateTaskApi(editingId, CreatedTask);
        delete form.dataset.editingId;
    } else {
        await Task_addition_db(CreatedTask);
    }
    
    await renderTasks();

    form.reset();
    document.getElementById("dateForm").reset();
}

function addCardTask(task) {
  const card = document.createElement("div");
  card.className = "task-card";

  card.innerHTML = `
    <div class="task-info">
        <span class="task-title">Task: ${task.title}</span>
        <span class="task-issued">Organization: ${task.organization}</span>
        <span class="task-date">Date: ${task.date}</span>
        <span class="task-time">Time: ${task.time.slice(0, 5)}</span>
    </div>

    <div class="buttons">
        <button type="button" class="button is-warning is-outlined edit-task-btn">
            <span>Edit</span>
            <span class="icon is-small">
                <i class="fa-solid fa-pen"></i>
            </span>
        </button>
        <button type="button" class="delete-task-btn">
            <span>Delete</span>
            <span class="icon is-small">
                <i class="fas fa-times"></i>
            </span>
        </button>
    </div>
  `;

    card.querySelector(".edit-task-btn").addEventListener("click", () => {
        document.querySelector("#title").value = task.title;
        document.querySelector("#organization").value = task.organization;
        document.querySelector("#location").value = task.location;
        document.querySelector("#voluntary").value = task.voluntary;
        document.querySelector("#age").value = task.age;
        document.querySelector("#description").value = task.description;
        document.querySelector("#date").value = task.date.slice(0, 10);
        document.querySelector("#time").value = task.time.slice(0, 5);

        document.querySelector("#adminForm").dataset.editingId = task.id;

        const submitBtn = document.querySelector("#submit-task-btn");
        if (submitBtn) {
            submitBtn.textContent = "Save";
        }
    });

    card.querySelector(".delete-task-btn").addEventListener("click", () => {
        const taskIdToDelete = task.id;
        deleteTaskApi(taskIdToDelete);
        if (card) {
            card.remove();
        }

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

async function Task_addition_db(CreatedTask) {
    const BASE_URL = "https://css330-finalproject.onrender.com/tasks";
    
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(CreatedTask)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (err) {
        console.error("Error adding task:", err);
    }
}

async function updateTaskApi(taskId, CreatedTask) {
    const BASE_URL = `https://css330-finalproject.onrender.com/tasks/${taskId}`;
    try {
        const response = await fetch(BASE_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(CreatedTask)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (err) {
        console.error("Error updating task:", err);
    }
}

async function deleteTaskApi(taskId) {
    const url = `https://css330-finalproject.onrender.com/tasks/${taskId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            alert(`Task ${taskId} deleted successfully from database.`);
        } else {
            const errorData = await response.json();
            alert(`Failed to delete task: ${errorData.error}`);
        }
    } catch (err) {
        console.error('Error deleting task:', err);
        alert('A network error occurred.');
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

async function loadProfile() {
    const user = await getCurrentUser();
    if (!user) return;

    renderUser(user);
}

async function getCurrentUser() {
    const url = "https://css330-finalproject.onrender.com/auth/user";

    try {
        const res = await window.fetch(url, {
            credentials: "include"
        });

        if (!res || !res.ok) return null;

        const data = await res.json();
        if (!data.authenticated) return null;

        return data.user;

    } catch (err) {
        console.error("Error fetching current user:", err);
        return null;
    }
}

function renderUser(user) {
    const container = document.getElementById("user-profile");
    if (!container || !user) return;

    container.innerHTML = `
        <img src="${user.profile_pic}" alt="Foto de perfil" class="profile-img">
        <h2 class="username">Welcome! ${user.name}</h2>
        <p class="bio">E-mail: ${user.email}</p>
        <p class="id-page">ID: ${user.google_id}</p>
        <ul class="profile-options">
            <li>
                <button class="logout-btn" type="button" onclick="logoutofGoogle()">
                    <i class="fa-solid fa-right-from-bracket"></i> 
                    <span> Logout </span>
                </button>
            </li>
        </ul>
    `;
}

async function isAdmin() {

    const user = await getCurrentUser(); 

    if (!user) {

        return;
    }

    if (user.google_id === ADMIN_GOOGLE_ID_1 || user.google_id === ADMIN_GOOGLE_ID_2) { 
        const navList = document.getElementById("navList");
        if (!navList) return;

        const li = document.createElement("li");
        li.innerHTML = `<a class="admin-link" href="/BetterBlock/admin.html">Administration</a>`;
        navList.appendChild(li);
    }
    else {
        return;
    }
}

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

function logoutofGoogle() {
    const backendUrl = "https://css330-finalproject.onrender.com/auth/logout"
    window.location.href = backendUrl
}


window.onload = function() {
    loadProfile();
    isAdmin();
    fetchUsers();
    renderTasks();

    addTaskTest('Develop API', 'TechCorp', 'Low', '2025-12-15');
    addTaskTest('Design UI', 'Designify', 'Medium', '2025-12-20');

};