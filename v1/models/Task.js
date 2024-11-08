const mongoose = require('mongoose');
const moment = require('moment'); // To format dates


// Clear the cached model 
delete mongoose.models['Task'];

const TaskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title:{type: String, required:true},
    description:{type: String, required:false ,unique:false},
    dueDate: {type: String, required:true},
    status: {type: String, enum: ['pending', 'in-progress', 'completed'],  default: 'pending'},
    priority:{type: String, enum:['low', 'medium','high'],required:true,default:'low'},
    createdBy:{type:mongoose.Types.ObjectId, ref: 'User',required:true},
    assignedTo: { type: String, match: /.+\@.+\..+/, required: false },
    tags: { type: [String], default: ['simple'] },
},
{ timestamps: true 

});

// Pre-save hook to format the dueDate before saving
TaskSchema.pre('save', function (next) {
    if (this.dueDate) {
        this.dueDate = moment(this.dueDate).format('YYYY-MM-DD'); // Store as formatted string
    }
    next();
});

// // Format the response
// TaskSchema.methods.toJSON = function () {
//     const obj = this.toObject();
//     obj.createdAt = moment(obj.createdAt).format('YYYY-MM-DD');
//     obj.updatedAt = moment(obj.updatedAt).format('YYYY-MM-DD');
//     obj.dueDate = moment(obj.dueDate).format('YYYY-MM-DD');
//     return obj;

// };

module.exports = mongoose.model('Task',TaskSchema);