const mongoose = require('mongoose');
const moment = require('moment'); // To format dates


// Clear the cached model 
delete mongoose.models['Task'];

const TaskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title:{type: String, required:true},
    description:{type: String, required:false ,unique:false},
    dueDate: {type: Date,required:true},
    status: {type: String,enum: ['pending', 'in-progress', 'completed'],  default: 'pending'},    
},
{ timestamps: true 

});


// Format the response
TaskSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.createdAt = moment(obj.createdAt).format('YYYY-MM-DD');
    obj.updatedAt = moment(obj.updatedAt).format('YYYY-MM-DD');
    obj.dueDate = moment(obj.dueDate).format('YYYY-MM-DD');
    return obj;

};

module.exports = mongoose.model('Task',TaskSchema);

// priority: {type: String, enum:{low, medium, high}},
// assignedTo: {type:String },
// tags:[]