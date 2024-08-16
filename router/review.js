const express = require('express');
const reviewRouter = express.Router();
const { createreview, viewallreview } = require('../controller/review');
const { upload } = require('../config/multerConfig');
const auth = require('../middleware/auth');

reviewRouter.post('/add/reviews', auth, upload.single("image"), createreview);
reviewRouter.get('/get/allreviews', auth, viewallreview);

module.exports = reviewRouter;
