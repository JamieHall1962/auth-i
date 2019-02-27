// https://github.com/JamieHall1962/auth-i/pull/1

const express = require("express");

const server = express();



server.use(express.json());



const usersRoutes = require("./users/router");

server.use("/api", usersRoutes);

port=4000;

server.listen({port}, () => console.log(`\nAPI is now running on port ${port}\n`));