const express = require("express");
const orderRouter = express.Router();
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

const { createOrder, updateOrderStatus, findUserOrder, findAllOrder, deleteOrder } = require('../controller/order');

// Route to create an order
orderRouter.post('/create/order', auth, createOrder);

// Route to update the status of an order
orderRouter.patch('/update/order_status', auth, checkRole, updateOrderStatus);

// Route to get a user's orders
orderRouter.get('/user/order', auth, findUserOrder);

// Route to get all users' orders
orderRouter.get('/allusers/order', auth, checkRole, findAllOrder);

// Route to delete an order
orderRouter.delete('/delete/order', auth, deleteOrder);

module.exports = orderRouter;
