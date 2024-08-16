const Size = require('../models/size');
const { checkValidStringType } = require("../utils/validation");

exports.createSize = async (req, res, next) => {
  try {
    const { size, active_status } = req.body;

    if (!size) {
      throw new Error("Please provide size");
    }

    checkValidStringType(size);

    if (typeof active_status !== 'boolean' && active_status !== undefined) {
      throw new Error("Active status must be a boolean");
    }

    const new_size = await Size.create({
      size,
      active_status
    });

    res.status(200).json({
      status: {
        message: "Successfully added!",
        code: 200,
        error: false
      },
      data: {
        new_size
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getActiveSizes = async (req, res, next) => {
  try {
    const { active_status } = req.query;

    let find_sizes;

    if (active_status !== undefined) {
      const booleanStatus = active_status === 'true';
      find_sizes = await Size.find({ active_status: booleanStatus });

      if (find_sizes.length === 0) {
        return res.status(400).json({
          status: {
            message: `No active sizes available with active_status: ${active_status}`,
            code: 400,
            error: true
          }
        });
      }

      return res.status(200).json({
        status: {
          message: `Successfully fetched sizes with active_status: ${active_status}`,
          code: 200,
          error: false
        },
        sizes: find_sizes
      });
    } else {
      find_sizes = await Size.find();

      if (find_sizes.length === 0) {
        return res.status(400).json({
          status: {
            message: "No sizes available",
            code: 400,
            error: true
          }
        });
      }

      return res.status(200).json({
        status: {
          message: "Successfully fetched all sizes",
          code: 200,
          error: false
        },
        sizes: find_sizes
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateActiveSize = async (req, res, next) => {
  try {
    const { size_id, active_status } = req.body;

    if (typeof active_status !== 'boolean' && active_status !== undefined) {
      throw new Error("Active status must be a boolean value");
    }

    const size = await Size.findOne({ size_id });

    if (!size) {
      throw new Error('Provided size_id does not exist');
    }

    size.active_status = active_status;

    await size.save();

    res.status(200).json({
      status: {
        message: "Successfully updated!",
        code: 200,
        error: false
      },
      data: {
        size
      }
    });
  } catch (error) {
    next(error);
  }
};
