const express = require("express");
const { add_main_sale, get_all_sale } = require("../controller/main_sale");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

const main_saleRouter = express.Router();

main_saleRouter.post("/add/main_sale", auth, checkRole, add_main_sale);
main_saleRouter.get("/get/list/sale/type", auth, get_all_sale);

module.exports = main_saleRouter;
