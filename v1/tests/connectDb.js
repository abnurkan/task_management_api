const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Function to start the in-memory MongoDB server and connect to it
const connect = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.disconnect(); // Disconnect from any previous connection
    await mongoose.connect(uri);
};

// Function to close the connection and stop the server
const close = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

module.exports = { connect, close };
