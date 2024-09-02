document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
document.getElementById('clearTasksBtn').addEventListener('click', clearAllTasks);
document.getElementById('allTasksBtn').addEventListener('click', () => filterTasks('all'));
document.getElementById('completedTasksBtn').addEventListener('click', () => filterTasks('completed'));
document.getElementById('incompleteTasksBtn').addEventListener('click', () => filterTasks('incomplete'));

document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === '') {
        alert('Please enter a task');
        return;
    }

    const task = {
        text: taskText,
        dueDate: dueDate,
        completed: false
    };

    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);

    taskInput.value = '';
    dueDateInput.value = '';
    loadTasks();
}

function clearAllTasks() {
    localStorage.removeItem('tasks');
    loadTasks();
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');

        const taskSpan = document.createElement('span');
        taskSpan.textContent = `${task.text} (Due: ${task.dueDate})`;
        taskSpan.addEventListener('click', function () {
            taskItem.classList.toggle('completed');
            task.completed = !task.completed;
            saveTasksToLocalStorage(tasks);
        });

        if (task.completed) {
            taskItem.classList.add('completed');
        }

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔';
        completeBtn.addEventListener('click', function () {
            taskItem.classList.toggle('completed');
            task.completed = !task.completed;
            saveTasksToLocalStorage(tasks);
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = '✎';
        editBtn.addEventListener('click', function () {
            const newTaskText = prompt('Edit your task', task.text);
            if (newTaskText !== null && newTaskText.trim() !== '') {
                task.text = newTaskText.trim();
                taskSpan.textContent = `${task.text} (Due: ${task.dueDate})`;
                saveTasksToLocalStorage(tasks);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.addEventListener('click', function () {
            tasks.splice(index, 1);
            saveTasksToLocalStorage(tasks);
            loadTasks();
        });

        taskItem.appendChild(taskSpan);
        taskItem.appendChild(completeBtn);
        taskItem.appendChild(editBtn);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    });
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
            case 'incomplete':
                task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                break;
        }
    });
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
