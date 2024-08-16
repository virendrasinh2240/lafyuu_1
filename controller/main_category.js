const MainCategory = require('../models/main_category');
const { checkValidStringType } = require('../utils/validation');

exports.addMainCategory = async (req, res, next) => {
    try {
        const { main_category_name } = req.body;

        if (!main_category_name) {
            throw new Error('Please Provide Main Category Name!');
        }

        checkValidStringType(main_category_name);

        const newMainCategory = new MainCategory({
            main_category_name
        });

        await newMainCategory.save();

        res.status(200).json({
            status: {
                message: "Successfully Main Category Added!",
                code: 200,
                error: false
            },
            data: {
                newMainCategory
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await MainCategory.find();

        if (categories.length === 0) {
            throw new Error("No Available Category Types");
        }

        res.status(200).json({
            status: {
                message: "Successfully fetched all the category types",
                code: 200,
                error: false
            },
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
