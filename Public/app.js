const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const taskList = document.getElementById('task-list');

// Fetch all tasks
const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost:3000/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const tasks = await response.json();
    if (!Array.isArray(tasks)) {
      throw new Error('Tasks data is not an array');
    }
    taskList.innerHTML = tasks.map(task => `
      <li>
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion('${task._id}')">
        ${task.title} (Due: ${task.dueDate})
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </li>
    `).join('');
  } catch (err) {
    console.error('Error fetching tasks:', err);
    taskList.innerHTML = '<li>Error loading tasks</li>';
  }
};

// Add a new task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: taskInput.value,
      dueDate: dueDateInput.value
    })
  });
  if (!response.ok) {
    throw new Error('Failed to add task');
  }
  taskInput.value = '';
  dueDateInput.value = '';
  fetchTasks();
});

// Delete a task
const deleteTask = async (id) => {
  await fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' });
  fetchTasks();
};

// Toggle task completion
const toggleTaskCompletion = async (id) => {
  const task = await fetch(`http://localhost:3000/tasks/${id}`);
  const updatedTask = await task.json();
  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !updatedTask.completed })
  });
  fetchTasks();
};

// Load tasks on page load
fetchTasks();