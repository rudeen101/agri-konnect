import Category from '../models/Category.model.js';
import slugify from 'slugify';

// export const getCategories = async (req, res) => {
//   try {
//     // Exclude categories where deleted: true
//     const categories = await Category.find({ deleted: { $ne: true } })
//       .populate('parent')
//       .sort({ displayOrder: 1, name: 1 }); // Optional: sort by displayOrder and name
    
//     res.status(200).json({ 
//       success: true, 
//       count: categories.length,
//       data: categories 
//     });
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Server error while fetching categories' 
//     });
//   }
// };

// export const getCategories = async (req, res) => {
//   res.status(200).json(res.advancedResults);
// };

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: { $ne: true } })
      .populate('parent')
      .populate('productCount') // Add this line
      .sort({ displayOrder: 1, name: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: categories.length,
      data: categories 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching categories' 
    });
  }
};

export const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id).populate('parent');
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, data: category });
};

export const createCategory = async (req, res) => {
  const slug = slugify(req.body.name, { lower: true });
  const newCategory = await Category.create({
     ...req.body,
      slug,
      createdBy: req.user.id
  });
  res.status(201).json({ success: true, data: newCategory });
};

export const updateCategory = async (req, res) => {
  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: updated });
};

// Soft delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || category.deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.deleted = true;
    await category.save();

    res.status(200).json({ success: true, message: 'Category soft-deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Restore a deleted category
export const restoreCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.deleted) {
      return res.status(404).json({ success: false, message: 'Category not found or not deleted' });
    }

    category.deleted = false;
    await category.save();

    res.status(200).json({ success: true, message: 'Category restored' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all categories excluding soft-deleted ones
// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find({ deleted: false });
//     res.status(200).json({ success: true, data: categories });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
