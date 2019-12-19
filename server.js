const express = require('express');
const server = express();
const helmet = require('helmet');
const cors = require('cors');

const apiRouter = require('./api/api-router');

server.use(express.json());
server.use(helmet());
server.use(cors());

server.get('/', (req, res)=> {
    res.status(200).json({message: "API up and running"})
})

server.use('/api/', apiRouter);

module.exports = server;