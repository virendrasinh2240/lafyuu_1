const express = require('express');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const { addProductToSale, getAllSaleProducts, removeSaleproduct } = require('../controller/sale');

const saleRouter = express.Router();

saleRouter.post('/add/salesProduct', auth, checkRole, addProductToSale);
saleRouter.get('/get/salesProduct', getAllSaleProducts);
saleRouter.delete('/delete/salesProduct', auth, checkRole, removeSaleproduct);

module.exports = saleRouter;
