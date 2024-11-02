const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: String },
    tags: [String],
    sharedWith: [{ type: String, ref: 'User', required: false }],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
