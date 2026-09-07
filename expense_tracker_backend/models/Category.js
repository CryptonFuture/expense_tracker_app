const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income', 'both'],
      default: 'expense',
    },
    icon: {
      type: String,
      default: '📁',
    },
    color: {
      type: String,
      default: '#6366f1',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
