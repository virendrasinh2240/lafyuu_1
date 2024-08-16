const express = require('express');
const { addBanner, getBanner, updateBanner, deleteBanner } = require('../controller/banner'); // Corrected import
const { upload } = require('../config/multerConfig');
const checkRole = require('../middleware/checkRole');
const auth = require('../middleware/auth');

const bannerRouter = express.Router();  // Corrected variable name

bannerRouter.post('/add/banner', auth, checkRole, upload.single('banner_image'), addBanner);
bannerRouter.get('/get/banner', getBanner);
bannerRouter.patch('/update/banner', auth, checkRole, updateBanner);
bannerRouter.delete('/delete/banner', auth, checkRole, deleteBanner); // Corrected function name

module.exports = bannerRouter;  // Corrected variable name
