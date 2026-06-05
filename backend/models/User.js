console.log('[Model Setup] Compiling User Schema...');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, { timestamps: true });

console.log('[Model Success] User Schema compiled successfully.');
module.exports = mongoose.model('User', userSchema);