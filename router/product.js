const express = require("express");
const productRouter = express.Router();

const { productAdd, getAllProducts, updateProduct } = require('../controller/product');
const { upload } = require('../config/multerConfig');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

productRouter.post("/add/product", auth, checkRole, upload.array("product_images"), productAdd);
productRouter.get("/get/allproduct", getAllProducts);
// productRouter.delete("/delete/product/:productId", auth, checkRole, deleteProduct);
productRouter.put("/update/product", auth, checkRole, upload.array("product_images"), updateProduct);

module.exports = productRouter;
