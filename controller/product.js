const Product = require("../models/product");
const { checkValidStringType } = require('../utils/validation');
const Color = require("../models/color");
const Category = require('../models/category');
const Notification = require("../models/notification");
const MainNotification = require("../models/main_notification");

exports.productAdd = async (req, res, next) => {
    try {
        const { product_images, product_name, color_ids, size_ids, product_rating, product_price, product_specification, active_status, is_notify, category_id } = req.body;

        const images = req.files;

        if (!size_ids) {
            throw new Error("Please provide size ids");
        }

        if (!color_ids) {
            throw new Error("Please provide color ids");
        }

        function convertStringToBoolean(value) {
            if (typeof value === 'undefined') {
                return false;
            }
            if (value === "true") {
                return true;
            } else if (value === "false") {
                return false;
            } else {
                throw new Error("active_status and is_notify must be boolean value");
            }
        }
        const result = convertStringToBoolean(active_status);
        const isnotify = convertStringToBoolean(is_notify);

        const sizeIdsArray = size_ids.map(id => parseInt(id));
        const colorIdsArray = color_ids.map(id => parseInt(id));

        if (!images || images.length === 0) {
            return res.status(400).json({ status: { message: 'Please provide at least 1 product image', code: 400, error: true } });
        } else if (images.length > 5) {
            return res.status(400).json({ status: { message: 'You can upload a maximum of 5 images', code: 400, error: true } });
        }

        if (!product_name) throw new Error('Please provide a product name.');
        checkValidStringType(product_name);

        const colors = await Color.find({ color_id: { $in: colorIdsArray } });
        if (colors.length !== colorIdsArray.length) {
            throw new Error("Provided color Ids do not exist");
        }

        const sizes = await Size.find({ size_id: { $in: sizeIdsArray } });
        if (sizes.length !== sizeIdsArray.length) {
            throw new Error("Provided size Ids do not exist");
        }

        if (!product_price || isNaN(product_price) || product_price <= 0) throw new Error('Please provide a valid product price.');

        if (!category_id) {
            throw new Error("Please provide category id");
        }

        const category = await Category.findOne({ category_id });
        if (!category) {
            throw new Error("Provided category id does not exist");
        }

        if (!product_specification) throw new Error('Please provide a product specification.');

        if (product_rating < 1 || product_rating > 5) {
            throw new Error("Product rating must be between 1 and 5.");
        }

        const imagePath = images.map(image => image.path);

        const product = new Product({
            product_images: imagePath,
            product_name,
            color_ids: colorIdsArray,
            size_ids: sizeIdsArray,
            product_rating,
            product_price,
            product_specification,
            active_status: result,
            is_notify: isnotify,
            category_id: parseInt(category_id)
        });

        await product.save();

        if (isnotify) {
            const existingNotifi = await MainNotification.findOne({ main_notification_id: 2 });
            if (!existingNotifi) {
                throw new Error("Provided main notification ID does not exist");
            }

            const notification = new Notification({
                logo: product.product_images[0],
                title: product.product_name,
                descriptions: product.product_specification,
                is_readable: false,
                main_notification_id: 2,
                date: new Date(),
            });
            await notification.save();
        }

        const colorIds = colors.map(color => ({ color_id: color.color_id, color_code: color.color_code }));
        const sizeIds = sizes.map(size => ({ size_id: size.size_id, size: size.size }));

        res.status(200).json({
            status: { message: "Successfully added product data.", code: 200, error: false },
            data: {
                product: {
                    product_id: product._id,
                    product_images: product.product_images,
                    product_name: product.product_name,
                    color: colorIds,
                    size: sizeIds,
                    product_rating: product.product_rating,
                    product_price: product.product_price,
                    product_specification: product.product_specification,
                    active_status: product.active_status,
                    is_notify: product.is_notify,
                    category_id: product.category_id,
                }
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const { category_id, min_price, max_price, sort, product_name } = req.query;

        let filter = {};
        if (category_id) {
            const findCategory = await Category.findOne({ category_id });
            if (!findCategory) {
                throw new Error("Provided category_id does not exist");
            }
            filter.category_id = category_id;
        }

        if (min_price && max_price) {
            filter.product_price = { $gte: min_price, $lte: max_price };
        } else if (min_price || max_price) {
            throw new Error("Please provide both min_price and max_price!");
        }

        let products = await Product.find(filter);

        if (sort) {
            if (sort === 'price_lowest') {
                products = await Product.find(filter).sort({ product_price: 1 });
            } else if (sort === 'price_highest') {
                products = await Product.find(filter).sort({ product_price: -1 });
            } else if (sort === 'newest_product') {
                products = await Product.find(filter).sort({ _id: -1 });
            }
        }

        if (product_name) {
            products = await Product.find({
                ...filter,
                product_name: { $regex: product_name, $options: 'i' }
            });
        }

        if (!products || products.length === 0) {
            throw new Error("No products found");
        }

        const productsWithDetails = await Promise.all(products.map(async (product) => {
            const colors = await Color.find({ color_id: { $in: product.color_ids } });
            const sizes = await Size.find({ size_id: { $in: product.size_ids } });

            return {
                product_id: product._id,
                product_images: product.product_images,
                product_name: product.product_name,
                color_ids: colors,
                size_ids: sizes,
                product_rating: product.product_rating,
                product_price: product.product_price,
                product_specification: product.product_specification,
                active_status: product.active_status,
                is_notify: product.is_notify,
                category_id: product.category_id,
            };
        }));

        res.status(200).json({
            status: {
                message: "Successfully fetched all products",
                code: 200,
                error: false
            },
            data: {
                products: productsWithDetails
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const { product_id } = req.query;
        const { product_images, product_price, product_specification, active_status, color_ids, size_ids } = req.body;

        const sizeIdsArray = size_ids.map(id => parseInt(id));
        const colorIdsArray = color_ids.map(id => parseInt(id));

        const fetchedColors = await Color.find({ color_id: { $in: colorIdsArray } });
        if (fetchedColors.length !== colorIdsArray.length) {
            throw new Error("Provided color IDs do not exist");
        }

        const fetchedSizes = await Size.find({ size_id: { $in: sizeIdsArray } });
        if (fetchedSizes.length !== sizeIdsArray.length) {
            throw new Error("Provided size IDs do not exist");
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(400).json({
                status: {
                    message: "Provided product_id does not exist",
                    code: 400,
                    error: true
                }
            });
        }

        if (product_images) {
            product.product_images = product_images;
        }
        if (product_price) {
            product.product_price = product_price;
        }
        if (product_specification) {
            product.product_specification = product_specification;
        }
        if (active_status !== undefined) {
            product.active_status = active_status === 'true';
        }

        await product.save();

        const colors = fetchedColors.map(color => ({ color_id: color.color_id, color_code: color.color_code }));
        const sizes = fetchedSizes.map(size => ({ size_id: size.size_id, size: size.size }));

        res.status(200).json({
            status: {
                message: "Product updated successfully",
                code: 200,
                error: false
            },
            data: {
                ...product.toObject(),
                color_ids: colors,
                size_ids: sizes
            }
        });
    } catch (error) {
        next(error);
    }
}
