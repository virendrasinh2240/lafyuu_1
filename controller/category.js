const Category = require('../models/category');
const MainCategory = require('../models/main_category');
const { checkValidStringType } = require('../utils/validation');
const path = require('path');

exports.addCategory = async (req, res, next) => {
    try {
        const { category_name, main_category_id } = req.body;

        if (!req.file) {
            throw new Error('Please Upload category Image!');
        }

        if (!category_name) throw new Error('Please Provide a Category Name!');
        checkValidStringType(category_name);

        const imagePath = req.file.path;

        const mainCategory = await MainCategory.findById(main_category_id);

        if (!mainCategory) {
            throw new Error("provided main_category is not exist.");
        }

        const category = new Category({
            category_name,
            category_image: imagePath,
            main_category_id
        });

        await category.save();

        res.status(200).json({
            status: {
                message: "Successfully Category Added!",
                code: 200,
                error: false
            },
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCategory = async (req, res, next) => {
    try {
        const { category_id, main_category_id } = req.query;

        if (category_id) {
            const category = await Category.findById(category_id).populate('main_category_id', 'main_category_name');

            if (!category) {
                throw new Error('No Category Available!');
            }

            res.status(200).json({
                status: {
                    message: "Successfully Category Fetch!",
                    code: 200,
                    error: false
                },
                data: category
            });
        } else if (main_category_id) {
            const categories = await Category.find({ main_category_id }).populate('main_category_id', 'main_category_name');

            if (categories.length === 0) {
                throw new Error("No Category Available for the provided main_category_id!");
            }

            res.status(200).json({
                status: {
                    message: "Successfully Category Fetch!",
                    code: 200,
                    error: false
                },
                data: categories
            });
        } else {
            const categories = await Category.find().populate('main_category_id', 'main_category_name');

            if (categories.length === 0) {
                throw new Error('No Category Available!');
            }

            res.status(200).json({
                status: {
                    message: "Successfully Category Fetch!",
                    code: 200,
                    error: false
                },
                data: categories
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const { category_id } = req.query;

        if (category_id) {
            const category = await Category.findById(category_id);

            if (!category) {
                throw new Error(`No Category Available for category id: ${category_id}`);
            }

            await Category.findByIdAndDelete(category_id);

            res.status(200).json({
                status: {
                    message: `Successfully Category Deleted for category_id: ${category_id}`,
                    code: 200,
                    error: false
                }
            });
        } else {
            await Category.deleteMany();

            res.status(200).json({
                status: {
                    message: 'Successfully All Categories Deleted!',
                    code: 200,
                    error: false
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const { category_id, category_status } = req.body;

        const category = await Category.findById(category_id);

        if (!category) {
            throw new Error("provided category_id does not exist.");
        }

        category.category_status = category_status;

        await category.save();

        res.status(200).json({
            status: {
                message: `Successfully Category Updated`,
                code: 200,
                error: false
            },
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
};
