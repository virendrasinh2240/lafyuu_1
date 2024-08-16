const express = require("express");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const { addMainCategory, getAllCategories } = require('../controller/main_category');

const mainCategoryRouter = express.Router();

mainCategoryRouter.post("/add/main_category", auth, checkRole, addMainCategory);
mainCategoryRouter.get("/get/list/category_type", auth, getAllCategories);

module.exports = mainCategoryRouter;
