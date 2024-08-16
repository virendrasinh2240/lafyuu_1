const MainSale = require("../models/main_sale");
const { checkValidStringType } = require("../utils/validation");

exports.add_main_sale = async (req, res, next) => {
    try {
        const { sale_name } = req.body;

        if (!sale_name) {
            throw new Error("Please add main sale name.");
        }

        checkValidStringType(sale_name);

        const mainsale = new MainSale({
            sale_name
        });

        await mainsale.save();

        return res.status(200).json({
            status: {
                message: "Successfully added data.",
                code: 200,
                error: false
            },
            data: {
                mainsale
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.get_all_sale = async (req, res, next) => {
    try {
        const sales = await MainSale.find();

        if (sales.length === 0) {
            throw new Error("No available sales types.");
        }

        return res.status(200).json({
            status: {
                message: "Successfully fetched all the sale types.",
                code: 200,
                error: false
            },
            data: sales
        });
    } catch (error) {
        next(error);
    }
};
