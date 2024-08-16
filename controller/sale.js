const Sale = require("../models/sale");
const Product = require("../models/product");
const Notification = require("../models/notification");
const MainSale = require("../models/main_sale");
const MainNotification = require("../models/main_notification");

exports.addProductToSale = async (req, res, next) => {
    try {
        const { sale_id, product_id, discount, is_notify } = req.body;

        const main = await MainSale.findOne({ sale_id });

        if (!main) {
            throw new Error("Provided sale id doesn't exist");
        }

        if (!Number.isInteger(sale_id) || !Number.isInteger(product_id) || !Number.isInteger(discount)) {
            throw new Error('Please provide valid integer values for sale_id, product_id, and discount.');
        }

        if (discount < 1 || discount > 100) {
            throw new Error("Discount must be between 1 and 100");
        }

        const product = await Product.findById(product_id);

        if (!product) {
            throw new Error("Provided product ID doesn't exist");
        }

        if (typeof is_notify !== 'boolean') {
            throw new Error("is_notify must be a boolean value");
        }

        const sale = await Sale.create({
            product_id,
            sale_id,
            discount,
            is_notify
        });

        if (is_notify) {
            const existingNotifi = await MainNotification.findOne({ main_notification_id: 2 });

            if (!existingNotifi) {
                throw new Error("Provided main notification ID does not exist");
            }

            await Notification.create({
                logo: product.product_images[0],
                title: `${product.product_name} ${discount}`,
                descriptions: product.product_specification,
                is_readable: false,
                main_notification_id: 2,
                date: new Date()
            });
        }

        res.status(200).json({
            status: {
                message: "Successfully added to sale",
                code: 200,
                error: false
            },
            data: {
                product: {
                    product_id,
                    sale: {
                        main,
                        discount,
                        is_notify: sale.is_notify,
                    }
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getAllSaleProducts = async (req, res, next) => {
    try {
        const { sale_id } = req.query;

        let find_sale;
        if (sale_id) {
            find_sale = await Sale.find({ sale_id });

            if (find_sale.length === 0) {
                throw new Error("Provided sale_id does not exist");
            }

            return res.status(200).json({
                status: {
                    message: `Successfully fetched products for sale_type: ${sale_id}`,
                    code: 200,
                    error: false
                },
                data: {
                    find_sale
                }
            });
        } else {
            find_sale = await Sale.find();

            if (find_sale.length === 0) {
                throw new Error('No products available!');
            }

            return res.status(200).json({
                status: {
                    message: "Successfully fetched all products with sale details!",
                    code: 200,
                    error: false
                },
                data: {
                    find_sale
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.removeSaleproduct = async (req, res, next) => {
    try {
        const { sale_product_id } = req.body;

        if (!sale_product_id) {
            throw new Error("Please enter the sale_product_id");
        }

        const result = await Sale.deleteOne({ _id: sale_product_id });

        if (result.deletedCount === 0) {
            return res.status(400).json({
                error: true,
                message: "Sale product with the provided ID doesn't exist"
            });
        }

        return res.status(200).json({
            status: {
                message: "Successfully deleted sale_product_id",
                code: 200,
                error: false
            }
        });
    } catch (error) {
        next(error);
    }
};
