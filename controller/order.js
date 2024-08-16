const Order = require("../models/order");
const User = require('../models/user');
const Address = require('../models/address');
const Cart = require('../models/cart');
const Product = require("../models/product");

exports.createOrder = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const { products, total_price, address_id } = req.body;

        if (!products) {
            throw new Error("Please provide products!");
        }

        if (!Number.isInteger(total_price)) {
            throw new Error('Please provide a valid total_price!');
        }

        if (!address_id) {
            throw new Error('Please provide a valid address_id!');
        }

        const product_data = await Promise.all(products.map(async product => {
            const existing_Product = await Product.findOne({ product_id: product.product_id });
            if (!existing_Product) {
                throw new Error(`Product does not exist for product_id: ${product.product_id}`);
            }
            return {
                product_id: product.product_id,
                product_image: product.product_image,
                product_name: product.product_name,
                product_color: product.product_color,
                product_size: product.product_size,
                quantity: product.quantity,
                products_price: product.products_price
            };
        }));

        const address = await Address.findOne({ address_id });
        if (!address) {
            throw new Error("Provided address_id does not exist");
        }

        const order = new Order({
            user_id,
            products: product_data,
            total_price,
            address_id
        });

        await order.save();

        await Cart.deleteMany({ user_id });

        res.status(200).json({
            status: {
                message: "Successfully ordered",
                code: 200,
                error: false
            },
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { order_id, order_status } = req.body;

        const order = await Order.findOne({ order_id });

        if (!order) {
            throw new Error('Provided order_id does not exist');
        }

        const validStatuses = ["Packing", "Shipping", "Arriving", "Success"];
        if (!validStatuses.includes(order_status)) {
            throw new Error("Only enter Packing, Shipping, Arriving, or Success");
        }

        order.order_status = order_status;
        await order.save();

        res.status(200).json({
            status: {
                message: "Order status updated successfully",
                code: 200,
                error: false
            },
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

exports.findUserOrder = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;

        const orders = await Order.find({ user_id });

        if (!orders.length) {
            throw new Error("No orders found for the user");
        }

        const user = await User.findOne({ user_id });
        if (!user) {
            throw new Error("User not found");
        }

        const product_ids = orders.flatMap(order =>
            order.products.map(product => product.product_id)
        );

        const products = await Product.find({ product_id: { $in: product_ids } });

        const address_ids = orders.map(order => order.address_id);
        const user_Addresses = await Address.find({ address_id: { $in: address_ids } });

        const order_data = orders.map(order => {
            const address_info = user_Addresses.find(address => address.address_id === order.address_id);

            return {
                order_id: order.order_id,
                date_shipping: order.date_shipping,
                total_price: order.total_price,
                order_status: order.order_status,
                products: order.products.map(prod => {
                    const product_info = products.find(product => product.product_id === prod.product_id);
                    return {
                        product_id: prod.product_id,
                        product_image: prod.product_image,
                        product_name: prod.product_name,
                        product_color: prod.product_color,
                        product_size: prod.product_size,
                        quantity: prod.quantity,
                        product_price: prod.products_price
                    };
                }),
                Address: {
                    region: address_info.region,
                    first_name: address_info.first_name,
                    last_name: address_info.last_name,
                    street_Address: address_info.street_Address,
                    street_Address2: address_info.street_Address2,
                    city: address_info.city,
                    state: address_info.state,
                    zip_code: address_info.zip_code,
                    phone_number: address_info.phone_number
                }
            };
        });

        if (order_data.length === 0) throw new Error("No order available!");

        res.status(200).json({
            status: {
                message: "Successfully fetched user order details",
                code: 200,
                error: false
            },
            data: {
                user: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    user_name: user.user_name,
                    email: user.email
                },
                order: order_data
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.findAllOrder = async (req, res, next) => {
    try {
        const orders = await Order.find({});

        if (!orders.length) throw new Error("No orders available!");

        const user_ids = orders.map(order => order.user_id);
        const users = await User.find({ user_id: { $in: user_ids } });

        const product_ids = orders.flatMap(order =>
            order.products.map(product => product.product_id)
        );
        const products = await Product.find({ product_id: { $in: product_ids } });

        const address_ids = orders.map(order => order.address_id);
        const user_Addresses = await Address.find({ address_id: { $in: address_ids } });

        const order_data = orders.map(order => {
            const user_info = users.find(user => user.user_id === order.user_id);
            const address_info = user_Addresses.find(address => address.address_id === order.address_id);

            return {
                order_id: order.order_id,
                date_shipping: order.date_shipping,
                total_price: order.total_price,
                order_status: order.order_status,
                user: {
                    user_id: order.user_id,
                    email: user_info.email,
                    address_id: address_info.address_id,
                    region: address_info.region,
                    first_name: address_info.first_name,
                    last_name: address_info.last_name,
                    street_Address: address_info.street_Address,
                    street_Address2: address_info.street_Address2,
                    city: address_info.city,
                    state: address_info.state,
                    zip_code: address_info.zip_code,
                    phone_number: address_info.phone_number
                },
                products: order.products.map(prod => {
                    const product_info = products.find(product => product.product_id === prod.product_id);

                    return {
                        product_id: prod.product_id,
                        product_image: prod.product_image,
                        product_name: prod.product_name,
                        product_color: prod.product_color,
                        product_size: prod.product_size,
                        quantity: prod.quantity,
                        product_price: prod.products_price
                    };
                }),
            };
        });

        res.status(200).json({
            status: {
                message: "Successfully found all user orders",
                code: 200,
                error: false
            },
            data: {
                order_data
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const { order_id } = req.body;

        const user = await User.findOne({ user_id });
        if (!user) {
            throw new Error("Provided user_id does not exist");
        }

        const order = await Order.findOne({ order_id });
        if (!order) {
            throw new Error("Provided order_id does not exist");
        }

        await Order.deleteOne({ order_id });

        return res.status(200).json({
            status: {
                message: 'Order deleted successfully',
                code: 200,
                error: false
            },
        });
    } catch (error) {
        next(error);
    }
};
