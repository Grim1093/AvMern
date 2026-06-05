console.log('[Model Setup] Compiling Task Schema...');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required']
    },
    description: {
        type: String,
        required: false
    },
    tag: {
        type: String,
        enum: ['Work', 'Personal', 'Urgent', 'Other'],
        default: 'Other'
    },
    dueDate: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required to create a task']
    }
}, { timestamps: true });

console.log('[Model Success] Task Schema compiled successfully.');
module.exports = mongoose.model('Task', taskSchema);