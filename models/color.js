const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Color schema
const colorSchema = new Schema({
  color_id: {
    type: Number,
    required: true,
    unique: true,
    autoIncrement: true, // Note: Mongoose does not support auto-increment out-of-the-box. You'll need a plugin like `mongoose-auto-increment` for this feature.
  },
  color_code: {
    type: String,
    required: true,
    unique: true
  },
  active_color: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: false // Mongoose adds `createdAt` and `updatedAt` fields by default if set to true.
});

// Create the Color model
const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
