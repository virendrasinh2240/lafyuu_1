const Cart = require('../models/cart'); // Mongoose model for Cart
const Product = require('../models/product'); // Mongoose model for Product
const User = require('../models/user'); // Mongoose model for User

exports.addToCart = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { product_id } = req.body;

        // Validate if the product exists
        const product = await Product.findById(product_id).select('product_name product_price');
        if (!product) {
            return res.status(400).json({
                status: {
                    message: "Provided Product ID doesn't exist",
                    code: 400,
                    error: true
                }
            });
        }

        // Check if the cart item already exists
        let cartItem = await Cart.findOne({ product_id, user_id });

        if (!cartItem) {
            cartItem = new Cart({
                product_id,
                quantity: 1,
                total_price: product.product_price,
                user_id
            });
            await cartItem.save();
        } else {
            // Update existing cart item
            cartItem.quantity += 1;
            cartItem.total_price += product.product_price;
            await cartItem.save();
        }

        res.status(200).json({
            status: {
                message: "Successfully added to cart",
                code: 200,
                error: false
            },
            data: {
                cartItem
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getCartForUser = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        // Fetch cart items for the user and populate product details
        const cart = await Cart.find({ user_id }).populate('product_id', 'product_name product_images product_specification');

        if (cart.length === 0) {
            return res.status(400).json({
                status: {
                    message: 'Cart is empty',
                    code: 400,
                    error: true
                }
            });
        }

        res.status(200).json({
            status: {
                message: 'Successfully fetched cart',
                code: 200,
                error: false
            },
            data: {
                cart
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { cart_id, quantity } = req.body;

        // Find cart item and populate product details
        const cartItem = await Cart.findById(cart_id).populate('product_id', 'product_price');

        if (!cartItem) {
            return res.status(400).json({
                status: {
                    message: "Provided cart_id doesn't exist",
                    code: 400,
                    error: true
                }
            });
        }

        const product = cartItem.product_id;

        if (quantity <= 0) {
            return res.status(400).json({
                status: {
                    message: "Quantity should be 1 and more",
                    code: 400,
                    error: true
                }
            });
        }

        // Update quantity and total_price
        const quantityChange = quantity - cartItem.quantity;
        cartItem.quantity = quantity;
        cartItem.total_price += quantityChange * product.product_price;

        await cartItem.save();

        res.status(200).json({
            status: {
                message: "Successfully updated cart item",
                code: 200,
                error: false
            },
            data: {
                cartItem
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        const { cart_id } = req.query;

        if (cart_id) {
            const cartItem = await Cart.findById(cart_id);

            if (!cartItem) {
                return res.status(400).json({
                    status: {
                        message: "Provided cart_id doesn't exist",
                        code: 400,
                        error: true
                    }
                });
            }

            await Cart.findByIdAndDelete(cart_id);

            return res.status(200).json({
                status: {
                    message: "Successfully removed item from cart",
                    code: 200,
                    error: false
                }
            });
        } else {
            // Remove all cart items for the user
            await Cart.deleteMany();

            return res.status(200).json({
                status: {
                    message: "Successfully cleared all cart items",
                    code: 200,
                    error: false
                }
            });
        }
    } catch (error) {
        next(error);
    }
};
