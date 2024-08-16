const path = require('path');
const Review = require('../models/review');
const Product = require('../models/product');
const User = require('../models/user');
const { checkValidStringType } = require('../utils/validation');

exports.createreview = async (req, res, next) => {
    try {
        const { rate, review_detail, product_id } = req.body;

        const product = await Product.findOne({ product_id });
        if (!product) {
            throw new Error("Provided product_id does not exist");
        }

        if (!rate) {
            throw new Error("Please enter the rate");
        }

        if (!review_detail) {
            throw new Error("Please enter the review detail");
        }

        checkValidStringType(review_detail);

        const checkValidIntegerType = (value) => {
            if (isNaN(parseInt(value)) || !Number.isInteger(parseInt(value))) {
                throw new Error("Please provide a valid integer value.");
            }
        };
        checkValidIntegerType(rate);

        let imagePath = null;
        if (req.file && req.file.path) {
            imagePath = req.file.path;
        }

        if (rate < 1 || rate > 5) {
            throw new Error("Rate must be between 1 and 5");
        }

        const newreview = new Review({ 
            rate, 
            review_detail, 
            image: imagePath, 
            product_id 
        });

        await newreview.save();

        res.status(200).json({
            status: {
                message: "Successfully added!",
                code: 200,
                error: false
            },
            data: {
                newreview
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.viewallreview = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        const user = await User.findOne({ user_id }, 'user_name user_profile');
        if (!user) {
            return res.status(400).json({
                status: {
                    message: 'Provided user_id does not exist',
                    code: 400,
                    error: true
                }
            });
        }

        const allReviews = await Review.find({});
        if (!allReviews || allReviews.length === 0) {
            return res.status(400).json({
                status: {
                    message: "No reviews found",
                    code: 400,
                    error: true
                }
            });
        }

        const reviewsWithProducts = allReviews.map(review => ({
            reviews: {
                product_review_id: review._id,
                rate: review.rate,
                review_detail: review.review_detail,
                image: review.image,
            }
        }));

        res.status(200).json({
            status: {
                message: "Successfully fetched all reviews",
                code: 200,
                error: false
            },
            data: {
                user: user.toObject(),
                reviews: reviewsWithProducts
            }
        });
    } catch (error) {
        next(error);
    }
};
