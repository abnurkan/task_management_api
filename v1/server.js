//Server entry point
const http = require('http');
const app = require('./app');
require('dotenv').config();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT,() =>{
    console.log(`server started at http://localhost:${PORT}`)
    console.log(`API documentation started at http://localhost:${PORT}/api-docs`)
});