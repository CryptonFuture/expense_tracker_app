const Category = require('../models/Category');

const defaultCategories = [
  { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444' },
  { name: 'Transportation', type: 'expense', icon: '🚗', color: '#f97316' },
  { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#eab308' },
  { name: 'Bills & Utilities', type: 'expense', icon: '💡', color: '#22c55e' },
  { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#06b6d4' },
  { name: 'Health', type: 'expense', icon: '🏥', color: '#8b5cf6' },
  { name: 'Education', type: 'expense', icon: '📚', color: '#ec4899' },
  { name: 'Travel', type: 'expense', icon: '✈️', color: '#14b8a6' },
  { name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: '💼', color: '#3b82f6' },
  { name: 'Investment', type: 'income', icon: '📈', color: '#6366f1' },
  { name: 'Other', type: 'both', icon: '📁', color: '#64748b' },
];

exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    if (categories.length === 0) {
      await Category.insertMany(defaultCategories);
      categories = await Category.find().sort({ name: 1 });
    }
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const category = await Category.create({ name, type, icon, color });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
