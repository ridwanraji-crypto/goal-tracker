const goalInput = document.getElementById('goalInput');
const categoryInput = document.getElementById('categoryInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const addGoalBtn = document.getElementById('addGoalBtn');
const goalList = document.getElementById('goalList');
const sortByPriorityBtn = document.getElementById('sortByPriority');
const sortByDateBtn = document.getElementById('sortByDate');

// Goal data storage
let goals = [];

// Add goal function
addGoalBtn.addEventListener('click', () => {
    const goal = goalInput.value.trim();
    const category = categoryInput.value;
    const date = dateInput.value;
    const time = timeInput.value;

    if (goal && category && date && time) {
        const newGoal = {
            id: Date.now(),
            goal,
            category,
            date,
            time,
            priority: getPriority(category), // Assign priority based on category
            completed: false
        };

        goals.push(newGoal);
        renderGoals();

        // Clear inputs
        goalInput.value = '';
        dateInput.value = '';
        timeInput.value = '';

        // Success message
        alert('Task added successfully!');
    } else {
        alert('Please fill in all the fields.');
    }
});

// Assign priority based on category
function getPriority(category) {
    if (category === 'Work') return 'High';
    if (category === 'Study') return 'Medium';
    return 'Low';
}

// Render goals to the UI
function renderGoals() {
    goalList.innerHTML = ''; // Clear list
    goals.forEach((goal) => {
        const li = document.createElement('li');
        li.classList.add('goal-item');
        li.innerHTML = `
            <span>
                ${goal.goal} 
                <span class="category-badge ${goal.category.toLowerCase()}">
                    ${goal.category} (${goal.priority} Priority)
                </span> 
                - ${goal.date} ${goal.time}
            </span>
            <div class="actions">
                <button onclick="markComplete(${goal.id})">✅</button>
                <button onclick="deleteGoal(${goal.id})">🗑️</button>
            </div>
        `;
        if (goal.completed) {
            li.style.textDecoration = 'line-through';
            li.style.color = 'gray';
        }
        goalList.appendChild(li);
    });
}

// Mark as complete manually
function markComplete(id) {
    const goal = goals.find((g) => g.id === id);
    if (goal) goal.completed = true;
    renderGoals();
}

// Delete goal
function deleteGoal(id) {
    goals = goals.filter((g) => g.id !== id);
    renderGoals();
    alert('Task removed successfully!');
}




// Sort by Priority
sortByPriorityBtn.addEventListener('click', () => {
    goals.sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    renderGoals();
});

// Sort by Due Date
sortByDateBtn.addEventListener('click', () => {
    goals.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    renderGoals();
});

// Automatically mark tasks as complete when time passes
function autoCompleteTasks() {
    const now = new Date();
    goals.forEach((goal) => {
        const taskTime = new Date(`${goal.date}T${goal.time}`);
        if (taskTime <= now && !goal.completed) {
            goal.completed = true;
        }
    });
    renderGoals();
}

// Check every minute for tasks to mark as complete
setInterval(autoCompleteTasks, 60000);

// Run autoCompleteTasks immediately on page load
autoCompleteTasks();
