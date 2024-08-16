const Favourite = require("../models/favourite");
const User = require("../models/user");
const Product = require("../models/product");

exports.addToFavourite = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const { product_id } = req.body;

        const user = await User.findById(user_id);
        const product = await Product.findById(product_id);

        if (!user) {
            throw new Error("Provided user_id does not exist");
        }
        if (!product) {
            throw new Error("Provided product_id does not exist");
        }

        const existingFavourite = await Favourite.findOne({ user_id, product_id });
        if (existingFavourite) {
            throw new Error("This product is already in your favourites");
        }

        const newFavourite = new Favourite({ user_id, product_id });
        await newFavourite.save();

        res.status(200).json({
            status: {
                message: "Product successfully added to favourites",
                code: 200,
                error: false
            },
            data: { newFavourite }
        });
    } catch (err) {
        next(err);
    }
};

exports.removeFromFavourite = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const { product_id } = req.body;

        const user = await User.findById(user_id);
        if (!user) {
            throw new Error("Provided user_id does not exist");
        }

        const favourite = await Favourite.findOneAndDelete({ user_id, product_id });
        if (!favourite) {
            throw new Error("The product is not in favourites");
        }

        res.status(200).json({
            status: {
                message: "Successfully removed product from favourites",
                code: 200,
                error: false
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.findUserFavourite = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;

        if (!user_id) {
            throw new Error("Please provide a user_id");
        }

        const favourites = await Favourite.find({ user_id }).populate('product_id');
        if (favourites.length === 0) {
            throw new Error("Your favourite list is currently empty");
        }

        const favourite_products = favourites.map(fav => fav.product_id);

        res.status(200).json({
            status: {
                message: "User's favourite products",
                code: 200,
                error: false
            },
            data: { favourite_products }
        });
    } catch (err) {
        next(err);
    }
};

exports.favouriteByProducts = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        if (!user_id) {
            throw new Error("Please provide a user_id");
        }

        const { product_id } = req.query;
        let product_data = [];

        if (product_id) {
            const product = await Product.findById(product_id);
            if (!product) {
                throw new Error("Provided product_id does not exist");
            }

            const users = await User.find({ _id: { $in: (await Favourite.find({ product_id }).select('user_id')).map(fav => fav.user_id) } });

            if (users.length === 0) {
                throw new Error("No users found for this product");
            }

            product_data.push({
                product: {
                    product_id: product._id,
                    product_image: product.product_image,
                    product_name: product.product_name,
                    product_price: product.product_price
                },
                users: users.map(user => ({
                    user_id: user._id,
                    full_name: user.full_name,
                    user_name: user.user_name,
                    email: user.email
                }))
            });
        } else {
            const favourites = await Favourite.find({}).populate('product_id');
            const products = favourites.map(fav => fav.product_id);

            for (const product of products) {
                const users = await User.find({ _id: { $in: (await Favourite.find({ product_id: product._id }).select('user_id')).map(fav => fav.user_id) } });

                product_data.push({
                    product: {
                        product_id: product._id,
                        product_image: product.product_image,
                        product_name: product.product_name,
                        product_price: product.product_price
                    },
                    users: users.map(user => ({
                        user_id: user._id,
                        full_name: user.full_name,
                        user_name: user.user_name,
                        email: user.email
                    }))
                });
            }

            res.status(200).json({
                status: {
                    message: "Favourite Products and Users",
                    code: 200,
                    error: false
                },
                data: product_data
            });
        }
    } catch (err) {
        next(err);
    }
};
