const express = require("express");


const server = express();

server.use(express.json());


const usersRoutes = require("./users/usersRoutes");

server.use("/api", usersRoutes);

server.listen(4000, () => console.log("\nrunning on port 3300\n"));