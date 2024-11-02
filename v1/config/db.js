const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected."))
    .catch(error => {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    });
};

module.exports = connectDB;
