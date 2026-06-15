document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskCategory = document.getElementById("taskCategory");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    const filterBtns = document.querySelectorAll(".filter-btn");

    let tasks = JSON.parse(localStorage.getItem("pro_tasks")) || [];
    let currentFilter = "all";

    function renderTasks() {
        taskList.innerHTML = "";
        let filteredTasks = tasks;

        if (currentFilter === "pending") {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (currentFilter === "completed") {
            filteredTasks = tasks.filter(t => t.completed);
        }

        filteredTasks.forEach((task, index) => {
            // Find the true index in the main array
            const trueIndex = tasks.indexOf(task);
            const li = document.createElement("li");
            
            if (task.completed) li.classList.add("completed");

            // Category styling logic
            let catClass = "cat-Personal";
            if (task.category.includes("Dev")) catClass = "cat-Dev";
            if (task.category.includes("Assignment")) catClass = "cat-Assignment";

            li.innerHTML = `
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <span class="task-category ${catClass}">${task.category}</span>
                </div>
                <div class="actions">
                    <button class="complete-btn" onclick="toggleComplete(${trueIndex})">✔</button>
                    <button class="delete-btn" onclick="deleteTask(${trueIndex})">✖</button>
                </div>
            `;
            taskList.appendChild(li);
        });

        updateStats();
    }

    addBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        const category = taskCategory.value;
        
        if (text !== "") {
            tasks.push({ text, category, completed: false });
            saveAndRender();
            taskInput.value = "";
        }
    });

    taskInput.addEventListener("keypress", (e) => {
        if(e.key === "Enter") addBtn.click();
    });

    window.toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveAndRender();
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveAndRender();
    };

    clearCompletedBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => !t.completed);
        saveAndRender();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            renderTasks();
        });
    });

    function updateStats() {
        const pending = tasks.filter(t => !t.completed).length;
        taskCount.innerText = `${pending} task${pending !== 1 ? 's' : ''} left`;
    }

    function saveAndRender() {
        localStorage.setItem("pro_tasks", JSON.stringify(tasks));
        renderTasks();
    }

    renderTasks();
});
