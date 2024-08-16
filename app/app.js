const express = require('express');
const userRouter = require('../router/userRouter');
const addressRouter = require('../router/address');
const bannerRouter = require('../router/banner'); // Corrected import
const cartRouter = require('../router/cart');
const categoryRouter = require('../router/category');
const main_categoryRouter = require('../router/main_category');
const colorRouter = require('../router/color');
const favouriteRouter = require('../router/favourite');
const main_noticationRouter = require('../router/main_notification');
const main_saleRouter = require('../router/main_sale');
const notificationRouter = require('../router/notification');
const sizeRouter = require('../router/size');
const productRouter = require('../router/product');
const orderRouter = require('../router/order');
const saleRouter = require('../router/sale');
const paymentRouter = require('../router/payment');
const reviewRouter = require('../router/review');

const app = express();

app.use(express.json()); // Make sure to include middleware like body-parser if needed

app.use('/user', userRouter);
app.use('/address', addressRouter);
app.use('/banner', bannerRouter);
app.use('/cart', cartRouter);
app.use('/category', categoryRouter);
app.use('/main-category', main_categoryRouter);
app.use('/color', colorRouter);
app.use('/favourite', favouriteRouter);
app.use('/main-notification', main_noticationRouter);
app.use('/main-sale', main_saleRouter);
app.use('/notification', notificationRouter);
app.use('/size', sizeRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/sale', saleRouter);
app.use('/payment', paymentRouter);
app.use('/review', reviewRouter);

module.exports = app;
