const Color = require('../models/color');
const { checkValidStringType } = require('../utils/validation');

exports.addColor = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { color_code, active_color } = req.body;

    if (!color_code) {
      throw new Error("Please provide color code");
    }

    function isValidColorCode(value) {
      if (!/^#([A-Fa-f0-9]{6})$/.test(value)) {
        throw new Error('Invalid color code format. It must be in the format #RRGGBB');
      }
    }

    isValidColorCode(color_code);

    if (!user_id) {
      throw new Error("Please provide a user id");
    }

    if (active_color !== undefined && typeof active_color !== 'boolean') {
      throw new Error('active_color must be a boolean value');
    }

    const existingColor = await Color.findOne({ color_code });

    if (existingColor) {
      throw new Error("Color already added");
    }

    const color = new Color({
      color_code,
      active_color,
    });

    await color.save();

    res.status(200).json({
      status: {
        message: "Successfully added color!",
        code: 200,
        error: false,
      },
      data: {
        color,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllColor = async (req, res, next) => {
  try {
    const { active_color } = req.query;

    let findColor;

    if (active_color) {
      function toBoolean(value) {
        if (value === "true") {
          return true;
        } else if (value === "false") {
          return false;
        } else {
          throw new Error("active_color must be a boolean value");
        }
      }

      findColor = await Color.find({
        active_color: toBoolean(active_color)
      });
    } else {
      findColor = await Color.find();
    }

    if (findColor.length === 0) {
      throw new Error("No color available!");
    }

    res.status(200).json({
      status: {
        message: "Successfully fetched colors",
        code: 200,
        error: false,
      },
      data: {
        colors: findColor
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateColor = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    
    if (!user_id) {
      throw new Error("Please provide a user id");
    }

    const { color_id, active_color } = req.body;

    if (!color_id) {
      throw new Error("Please provide color_id");
    }

    const updatedColor = await Color.findOne({ color_id });

    if (!updatedColor) {
      throw new Error("Provided color_id does not exist");
    }
    
    if (typeof active_color !== 'boolean') {
      throw new Error('Please provide a valid active_color boolean value');
    }

    updatedColor.active_color = active_color;
    await updatedColor.save();

    res.status(200).json({
      status: {
        message: "Successfully updated color!",
        code: 200,
        error: false,
      },
      data: {
        updatedColor
      }
    });
  } catch (error) {
    next(error);
  }
};
