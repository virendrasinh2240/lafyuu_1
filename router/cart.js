const express = require('express');
const { addToCart, getCartForUser, deleteCartItem, updateCartItem } = require('../controller/cart');
const auth = require('../middleware/auth');

const cartRouter = express.Router();

// Route to add an item to the cart
cartRouter.post('/add', auth, addToCart);

// Route to get all cart items for the user
cartRouter.get('/all', auth, getCartForUser);

// Route to delete a specific cart item or all cart items
cartRouter.delete('/delete', auth, deleteCartItem);

// Route to update a specific cart item
cartRouter.patch('/update', auth, updateCartItem);

module.exports = cartRouter;
