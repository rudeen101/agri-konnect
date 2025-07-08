import Product from '../models/Product.model.js';
import slugify from 'slugify';

// Create a product
export const createProduct = async (req, res) => {
  const data = { ...req.body, createdBy: req.user.id };
  const product = await Product.create(data);
  res.status(201).json({ success: true, data: product });
};

// Get list (with filters, pagination, search)
export const getProducts = async (req, res) => {
  res.json(res.advancedResults);
};

// Get single product
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .where({ isActive: true })
    .populate('category');
    // .populate('category brand');
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: product });
};

// Update product
export const updateProduct = async (req, res) => {
  const data = { ...req.body, updatedBy: req.user._id };
  const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: product });
};

// Soft delete product
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).where({ isActive: true });
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  product.isActive = false;
  product.updatedBy = req.user._id;
  await product.save();
  res.json({ success: true, message: 'Product deactivated' });
};

export const deleteProductImage = async (req, res) => {
    const imageUrl = req.query.img;

    const productImage =  await Product.updateMany(
        { "images.url": imageUrl },
        { $pull: { images: { url: imageUrl } } }
    );
    if (!productImage) return res.status(404).json({ success: false, message: 'Not found' });

  res.json({ success: true, message: 'Product image deleted' });
};

// Static helper: get by category
export const getByCategory = async (req, res) => {
  const products = await Product.findByCategory(req.params.categoryId)
    .populate('category brand');
  res.json({ success: true, count: products.length, data: products });
};
