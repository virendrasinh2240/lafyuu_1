const express = require("express");
const { addColor, getAllColor, updateColor } = require("../controller/color");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const colorRouter = express.Router();

// Route for adding a new color
colorRouter.post("/add/color", auth, checkRole, addColor);

// Route for fetching all colors
colorRouter.get("/get/color", getAllColor);

// Route for updating a color
colorRouter.patch("/update/color", auth, checkRole, updateColor);

module.exports = colorRouter;
