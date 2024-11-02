const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(next);
});

module.exports = mongoose.model('User', userSchema);
