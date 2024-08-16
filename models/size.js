const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  size_id: {
    type: Number,
    required: true,
    unique: true,
    autoIncrement: true
  },
  size: {
    type: String,
    required: true
  },
  active_status: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: false
});

const Size = mongoose.model('Size', sizeSchema);

module.exports = Size;
