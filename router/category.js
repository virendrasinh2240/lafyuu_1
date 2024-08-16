const express = require("express");
const { addCategory, getAllCategory, deleteCategory, updateCategory } = require('../controller/category');
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const {upload} = require("../config/multerConfig");

const categoryRouter = express.Router();

// Route for adding a category
categoryRouter.post("/add", upload.single("category_image"), auth, checkRole, addCategory);

// Route for retrieving categories
categoryRouter.get("/", getAllCategory);

// Route for deleting a category
categoryRouter.delete("/", auth, checkRole, deleteCategory);

// Route for updating a category
categoryRouter.patch("/", auth, checkRole, updateCategory);

module.exports = categoryRouter;
