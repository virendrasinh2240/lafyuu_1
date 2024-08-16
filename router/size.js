const express = require("express");
const size_Router = express.Router();
const { createSize, getActiveSizes, updateActiveSize } = require('../controller/size');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

size_Router.post("/add/size", auth, checkRole, createSize);
size_Router.get("/get/size", getActiveSizes);
size_Router.put("/update/size", auth, checkRole, updateActiveSize);

module.exports = size_Router;
