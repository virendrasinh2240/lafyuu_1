const express = require("express");
const { addToFavourite, removeFromFavourite, findUserFavourite, favouriteByProducts } = require("../controller/favourite");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

const favouriteRouter = express.Router();

favouriteRouter.post("/add/favourite", auth, addToFavourite);
favouriteRouter.post("/remove/favourite", auth, removeFromFavourite);
favouriteRouter.post("/user/favourite/product", auth, findUserFavourite);
favouriteRouter.post("/get/favourite/product/byAdmin", auth, checkRole, favouriteByProducts);

module.exports = favouriteRouter;
