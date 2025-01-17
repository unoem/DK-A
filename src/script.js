document.addEventListener("DOMContentLoaded", function () {
  const addListButton = document.getElementById("add-list-btn");
  const listNameInput = document.getElementById("list-name");
  const taskListsContainer = document.getElementById("task-lists-container");

  // Function to load task lists from localStorage
  function loadTaskLists() {
    taskListsContainer.innerHTML = ''; // Clear existing task lists
    const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];

    taskLists.forEach((list, index) => {
      const listCard = document.createElement("div");
      listCard.className = "task-list-card";
      listCard.innerHTML = `
        <h3 contenteditable="true" data-index="${index}" class="editable-list-name">${list.name}</h3>
        <button class="remove-list-btn" data-index="${index}">X</button>
        <div class="filter-container">
          <label for="filter-${index}">Filter:</label>
          <select id="filter-${index}" class="task-filter" data-index="${index}">
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="tasks-container" id="tasks-container-${index}">
          ${list.tasks.map((task, taskIndex) => `
            <div class="task" data-status="${task.status}">
              <span contenteditable="true" class="editable-task-name" data-list-index="${index}" data-task-index="${taskIndex}">
                ${task.name}
              </span>
              <span>
                <select class="task-status" data-list-index="${index}" data-task-index="${taskIndex}">
                  <option value="todo" ${task.status === "todo" ? "selected" : ""}>To Do</option>
                  <option value="doing" ${task.status === "doing" ? "selected" : ""}>Doing</option>
                  <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
                </select>
              </span>
              <textarea class="editable-task-desc" data-list-index="${index}" data-task-index="${taskIndex}">${task.description || ""}</textarea>
              <button class="remove-task-btn" data-list-index="${index}" data-task-index="${taskIndex}">x</button>
            </div>
          `).join('')}
        </div>
        <input type="text" class="new-task-name" placeholder="New Task Name">
        <textarea class="new-task-desc" placeholder="New Task Description"></textarea>
        <button class="add-task-btn" data-index="${index}">Add Task</button>
      `;
      taskListsContainer.appendChild(listCard);
    });
  }

  // Add a new task list
  addListButton.addEventListener("click", function () {
    const listName = listNameInput.value.trim();
    if (!listName) {
      alert("Task list name cannot be empty.");
      return;
    }

    const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
    taskLists.push({ name: listName, tasks: [] });
    localStorage.setItem("taskLists", JSON.stringify(taskLists));
    listNameInput.value = ""; // Clear input field
    loadTaskLists(); // Reload task lists
  });

  // Remove a task list
  taskListsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-list-btn")) {
      const index = event.target.dataset.index;
      const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
      taskLists.splice(index, 1);
      localStorage.setItem("taskLists", JSON.stringify(taskLists));
      loadTaskLists(); // Reload task lists
    }
  });

  // Add a task to a task list
  taskListsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-task-btn")) {
      const listIndex = event.target.dataset.index;
      const taskNameInput = event.target.previousElementSibling.previousElementSibling;
      const taskDescInput = event.target.previousElementSibling;
      const taskName = taskNameInput.value.trim();
      const taskDescription = taskDescInput.value.trim();

      if (taskName) {
        const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
        const task = { name: taskName, status: "todo", description: taskDescription };
        taskLists[listIndex].tasks.push(task);
        localStorage.setItem("taskLists", JSON.stringify(taskLists));
        taskNameInput.value = ""; // Clear task input
        taskDescInput.value = ""; // Clear description input
        loadTaskLists(); // Reload task lists
      }
    }
  });

  // Filter tasks based on status
  taskListsContainer.addEventListener("change", function (event) {
    if (event.target.classList.contains("task-filter")) {
      const listIndex = event.target.dataset.index;
      const filterValue = event.target.value;
      const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
      const taskContainer = document.getElementById(`tasks-container-${listIndex}`);
      const tasks = taskContainer.querySelectorAll(".task");

      tasks.forEach((task, taskIndex) => {
        const taskStatus = taskLists[listIndex].tasks[taskIndex].status;
        if (filterValue === "all" || taskStatus === filterValue) {
          task.style.display = "flex"; // Show the task
        } else {
          task.style.display = "none"; // Hide the task
        }
      });
    }
  });

  // Other event listeners for removing tasks, saving changes, etc., remain the same.
  // ...

  // Initial load
  loadTaskLists();
});
