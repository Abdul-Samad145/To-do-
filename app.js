
const rForm = document.getElementById('registerForm');


function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
  }


if (rForm) 
    {
    rForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const userExists = users.some(user => user.email === email);

        if (userExists) 
            {
            alert('Email already exists. Try logging in.');
        }
        
        else {
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registered successfully please login.');
            window.location.href = "index.html";
        }
    });
}




const lForm = document.getElementById('loginForm');
if (lForm) 
    {
    lForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('em').value.trim();
        const password = document.getElementById('pass').value.trim();

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const validUser = users.find(user => user.email === email && user.password === password);

        if (validUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(validUser));
            window.location.href = "home.html";
        } else {
            alert('Invalid email or password.');
        }
    });
}


const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

if (userName && logoutBtn) 
    {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (!loggedInUser)
         {
        window.location.href = "index.html"; 
    }
    
    else
     {
        userName.textContent = loggedInUser.name;
    }

    logoutBtn.addEventListener('click', function () 
    {
        localStorage.removeItem('loggedInUser');
        window.location.href = "index.html";
    });
}
















// ===== TO-DO LIST FUNCTIONALITY =====

// DOM Elements
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const todoTableBody = document.getElementById('todoTableBody');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const editTaskInput = document.getElementById('editTaskInput');
const editTaskId = document.getElementById('editTaskId');
const saveEditBtn = document.getElementById('saveEditBtn');




// Initialize tasks array from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];





// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}





// Function to render tasks in the table
function renderTasks() {
    todoTableBody.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        
      
        const taskCell = document.createElement('td');
        taskCell.textContent = task.text;
        if (task.completed) {
            taskCell.style.textDecoration = 'line-through';
            taskCell.style.color = '#6c757d';
        }
        
    
        const statusCell = document.createElement('td');
        const statusCheckbox = document.createElement('input');
        statusCheckbox.type = 'checkbox';
        statusCheckbox.checked = task.completed;
        statusCheckbox.className = 'form-check-input';
        statusCheckbox.addEventListener('change', () => {
            tasks[index].completed = statusCheckbox.checked;
            saveTasks();
            renderTasks();
        });
        statusCell.appendChild(statusCheckbox);
        
      
        const actionsCell = document.createElement('td');
        
        // this is for Edit button bootstrap is used for button 
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-warning me-2';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            editTaskInput.value = task.text;
            editTaskId.value = index;
            editModal.show();
        });
        
        // this is for  Delete button bootstarp is used for button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });
        

        // this represents the "Actions" column in to-do table
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        


        // Append all cells to the row
        row.appendChild(taskCell);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);
        
        // Append row to table
        todoTableBody.appendChild(row);
    });
}






// Add new task
if (todoForm) {
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({
                text: taskText,
                completed: false
            });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    });
}





// for Edit task
if (saveEditBtn) {
    saveEditBtn.addEventListener('click', () => {
        const index = parseInt(editTaskId.value);
        const newText = editTaskInput.value.trim();
        
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
            editModal.hide();
        }
    });
}

// for  Initial render
renderTasks();