console.log('[Router Setup] Initializing Task routes...');
const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all task routes - user must be logged in
router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

console.log('[Router Success] Task routes configured and protected.');
module.exports = router;