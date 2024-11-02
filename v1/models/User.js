const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Clear the cached model 
delete mongoose.models['User'];

// Define the schema
const UserSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email: {type: String, required:true, unique:true},
    username: {type: String, required: false, unique: false },
    password: {type: String, required: true, unique: false}
});

// Pre-save hook to hash the password
UserSchema.pre('save', function (next) {
    const user = this;
    
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Generate a salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash; // Save the hashed password
            next();
        });
    });
});

// Create the model
const User = mongoose.model('User', UserSchema);
module.exports = User;
