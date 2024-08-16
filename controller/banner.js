const banner = require("../models/banner");
const Banner = require("../models/banner")

const { checkValidStringType } = require('../utils/validation');

exports.addBanner = async (req, res, next) => {
    try {
        const { banner_title, banner_countdown } = req.body;

        if (!req.file) throw new Error('Please Provide a Banner Image!');

        if (!banner_title) {
            throw new Error('Please Provide a Banner Title!');
        }

        checkValidStringType(banner_title);

        if (!banner_countdown || isNaN(Date.parse(banner_countdown))) {
            throw new Error('Please Provide a Valid Banner Countdown Date!');
        }

        const imagePath = req.file.path;

        const countdownDate = new Date(banner_countdown);
        const currentTime = new Date();

        let banner_status = true;
        let countdown_status = true;

        // Check countdown status
        if (countdownDate <= currentTime) {
            countdown_status = false;
            banner_status = false;
        }

        const newBanner = new Banner({
            banner_title,
            banner_countdown: countdownDate,
            banner_image: imagePath,
            banner_status,
            countdown_status
        });

        const bannerDate = await newBanner.save();

        res.status(200).json({
            status: {
                message: "Successfully Banner Added!",
                code: 200,
                error: false
            },
            data: {
                bannerDate
            }
        });
    } catch (error) {
        next(error);
    }
};


exports.getBanner = async (req, res, next) => {
    try {
        const allBanners = await Banner.find();

        if (allBanners.length === 0) {
            throw new Error('No Banner Available!');
        }

        res.status(200).json({
            status: {
                message: "Successfully Fetched Banners!",
                code: 200,
                error: false
            },
            data: {
                allBanners
            }
        });
    } catch (error) {
        next(error);
    }
};


exports.updateBanner = async (req, res, next) => {
    try {
        const { banner_id } = req.query;
        const { banner_status, countdown_status } = req.body;

        if (!banner_id) {
            return res.status(400).json({
                message: "Banner ID not provided",
                code: 400,
                error: true
            });
        }

        const banner = await Banner.findById(banner_id);

        if (!banner) {
            return res.status(404).json({
                message: "Provided banner_id does not exist.",
                code: 404,
                error: true
            });
        }

        // Validate and update banner status
        if (banner_status !== undefined) {
            if (typeof banner_status !== 'boolean') {
                return res.status(400).json({
                    message: "Please provide a boolean value for banner_status",
                    code: 400,
                    error: true
                });
            }
            banner.banner_status = banner_status;
        }

        // Validate and update countdown status
        if (countdown_status !== undefined) {
            if (typeof countdown_status !== 'boolean') {
                return res.status(400).json({
                    message: "Please provide a boolean value for countdown_status",
                    code: 400,
                    error: true
                });
            }
            banner.countdown_status = countdown_status;
        }

        await banner.save();

        return res.status(200).json({
            status: {
                message: "Banner status updated successfully",
                code: 200,
                error: false
            },
            data: {
                banner
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteBanner = async (req, res, next) => {
    try {
        const { banner_id } = req.query;

        if (banner_id) {
            const banner = await Banner.findByIdAndDelete(banner_id);

            if (!banner) {
                throw new Error("Provided banner_id does not exist.");
            }

            res.status(200).json({
                status: {
                    message: `Successfully Deleted Banner`,
                    code: 200,
                    error: false
                }
            });
        } else {
            const banners = await Banner.deleteMany();

            if (banners.deletedCount === 0) {
                throw new Error('No Banners Available!');
            }

            res.status(200).json({
                status: {
                    message: `Successfully Deleted All Banners!`,
                    code: 200,
                    error: false
                }
            });
        }
    } catch (error) {
        next(error);
    }
};
