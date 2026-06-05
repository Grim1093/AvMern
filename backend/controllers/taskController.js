const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
const getTasks = async (req, res) => {
    console.log(`[Task Step 1] Fetching tasks for User ID: ${req.user.id}`);
    try {
        const tasks = await Task.find({ userId: req.user.id });
        console.log(`[Task Success] Found ${tasks.length} tasks.`);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('[Task Error] Failed to fetch tasks:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
    console.log('[Task Step 1] Task creation request received.');
    if (!req.body.title) {
        console.error('[Task Error] Missing task title.');
        return res.status(400).json({ message: 'Please add a text field' });
    }

    try {
        console.log('[Task Step 2] Writing new task to database...');
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description || '',
            userId: req.user.id
        });
        console.log(`[Task Success] Task created with ID: ${task._id}`);
        res.status(201).json(task);
    } catch (error) {
        console.error('[Task Error] Failed to create task:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a task (Edit details or mark completed)
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
    console.log(`[Task Step 1] Update request for Task ID: ${req.params.id}`);
    
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            console.error('[Task Error] Task not found in database.');
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log('[Task Step 2] Verifying task ownership...');
        if (task.userId.toString() !== req.user.id) {
            console.error('[Task Error] User not authorized to update this task.');
            return res.status(401).json({ message: 'User not authorized' });
        }

        console.log('[Task Step 3] Applying updates...');
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        console.log(`[Task Success] Task ${req.params.id} updated successfully.`);
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('[Task Error] Failed to update task:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    console.log(`[Task Step 1] Delete request for Task ID: ${req.params.id}`);

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            console.error('[Task Error] Task not found in database.');
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log('[Task Step 2] Verifying task ownership...');
        if (task.userId.toString() !== req.user.id) {
            console.error('[Task Error] User not authorized to delete this task.');
            return res.status(401).json({ message: 'User not authorized' });
        }

        console.log('[Task Step 3] Removing task from database...');
        await task.deleteOne();

        console.log(`[Task Success] Task ${req.params.id} deleted successfully.`);
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error('[Task Error] Failed to delete task:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };