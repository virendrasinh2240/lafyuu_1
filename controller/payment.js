const Payment = require("../models/payment"); // Ensure this points to your Mongoose model
const { checkValidStringType } = require('../utils/validation');
const Order = require("../models/order");
const User = require("../models/user");
const Notification = require("../models/notification");
const Product = require("../models/product");
const MainNotification = require("../models/main_notification");

exports.paymentdetails = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        const { card_number, expiration_date, security_code, card_holdername, order_id, total_price, payment_status, is_notify } = req.body;

        const find_userid = await User.findById(user_id);
        if (!find_userid) {
            throw new Error("Provided user_id does not exist.");
        }

        if (!card_number) {
            throw new Error("Please provide a valid card number.");
        }

        function convertStringToBoolean(value) {
            if (value === undefined) {
                return false;
            }
            if (value === 'true' || value === true) {
                return true;
            } else if (value === 'false' || value === false) {
                return false;
            } else {
                throw new Error("is_notify must be a boolean value");
            }
        }
        const isNotify = convertStringToBoolean(is_notify);

        const expirationDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expirationDateRegex.test(expiration_date)) {
            throw new Error("Please provide a valid expiration date in MM/YY format.");
        }

        if (!security_code) {
            throw new Error("Please provide a valid security code.");
        }

        if (!card_holdername) {
            throw new Error("Please provide a valid card holder name.");
        }

        if (payment_status !== undefined && !["Success", "Failed"].includes(payment_status)) {
            throw new Error("Payment status must be either 'Success' or 'Failed'.");
        }

        checkValidStringType(card_holdername);

        const checkValidIntegerType = (value) => {
            if (isNaN(parseInt(value)) || !Number.isInteger(parseInt(value))) {
                throw new Error("Please provide a valid integer value.");
            }
        };

        checkValidIntegerType(security_code);
        checkValidIntegerType(total_price);

        const order = await Order.findById(order_id);
        if (!order) {
            throw new Error("Provided order_id does not exist.");
        }

        const payment_details = await Payment.create({
            card_number,
            expiration_date,
            security_code,
            card_holdername,
            total_price,
            user_id,
            order_id,
            payment_status,
            is_notify: isNotify
        });

        if (isNotify) {
            const product_ids = order.products.map(prod => prod.product_id);
            const products = await Product.find({ _id: { $in: product_ids } });

            const order_data = order.products.map(prod => {
                const product_info = products.find(product => product._id.toString() === prod.product_id.toString());
                return {
                    product_image: product_info.product_images[0],
                    product_name: product_info.product_name,
                    product_specification: product_info.product_specification
                };
            });

            const existingNotifi = await MainNotification.findOne({ main_notification_id: 1 });
            if (!existingNotifi) {
                throw new Error("Provided main notification ID does not exist.");
            }

            await Notification.create({
                logo: order_data[0].product_image,
                title: order_data[0].product_name,
                descriptions: order_data[0].product_specification,
                main_notification_id: 3,
                date: new Date()
            });
        }

        res.status(200).json({
            status: {
                message: "Payment successful",
                code: 200,
                error: false
            },
            data: {
                payment_details
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllPaymentsData = async (req, res, next) => {
    try {
        const { payment_status } = req.query;

        let payments;
        if (payment_status) {
            payments = await Payment.find({ payment_status });
            if (!payments.length) {
                throw new Error("No payments found with the provided status.");
            }

            return res.status(200).json({
                status: {
                    message: "Successfully fetched all payments",
                    code: 200,
                    error: false
                },
                data: {
                    payments
                }
            });
        } else {
            payments = await Payment.find();
            if (payments.length === 0) {
                return res.status(404).json({
                    status: {
                        message: "No payments available",
                        code: 404,
                        error: true
                    }
                });
            }
            return res.status(200).json({
                status: {
                    message: "Successfully fetched all payments",
                    code: 200,
                    error: false
                },
                data: {
                    payments
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.updatePaymentData = async (req, res, next) => {
    try {
        const { payment_id, payment_status } = req.body;

        if (!payment_id) {
            throw new Error("Payment ID is required.");
        }

        const payment = await Payment.findById(payment_id);
        if (!payment) {
            throw new Error("Payment ID does not exist.");
        }

        if (payment_status) {
            if (!["Success", "Failed"].includes(payment_status)) {
                throw new Error("Payment status must be either 'Success' or 'Failed'.");
            }
            payment.payment_status = payment_status;
        }

        await payment.save();

        res.status(200).json({
            status: {
                message: "Successfully updated payment status",
                code: 200,
                error: false
            },
            data: payment
        });
    } catch (error) {
        next(error);
    }
};
