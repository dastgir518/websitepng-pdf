const tasks = [];

// Function to create a task
function createTask(url) {
    const taskId = Date.now().toString();
    const task = { id: taskId, url, status: 'pending', result: null, error: null };
    tasks.push(task);
    return taskId;
}

// Function to update a task
function updateTask(taskId, status, result = null, error = null) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = status;
        task.result = result;
        task.error = error;
    }
}

// Function to get a task by ID
function getTask(taskId) {
    return tasks.find(t => t.id === taskId);
}

module.exports = { createTask, updateTask, getTask };
