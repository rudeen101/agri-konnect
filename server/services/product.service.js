import Product from '../models/Product.model.js';
import ErrorResponse from '../utils/errorResponse.js';
import InventoryLog from '../models/InventoryLog.model.js';
import { uploadToCloudinary } from './storage.service.js';

class ProductService {
    // Create product with variants
    async createProduct(productData, userId) {
        // Handle main product
        const product = new Product({
            ...productData,
            createdBy: userId
        });

        // Handle variants
        if (productData.variants && productData.variants.length > 0) {
            product.variants = productData.variants.map(variant => ({
                ...variant,
                sku: this.generateSKU(productData.category),
                inventory: variant.inventory || 0
            }));
        }

        await product.save();

        // Initial inventory log
        if (product.inventory > 0 || product.variants?.length > 0) {
            await InventoryLog.create({
                product: product._id,
                type: 'initial',
                quantity: product.inventory,
                performedBy: userId,
                variants: product.variants?.map(v => ({
                    variantId: v._id,
                    quantity: v.inventory
                }))
            });
        }

        return product;
    }

    // Update product inventory
    async updateInventory(productId, updateData, userId) {
        const { operation, quantity, variantId, reason } = updateData;
        
        const update = {};
        const logData = {
            product: productId,
            type: operation,
            quantity,
            reason,
            performedBy: userId
        };

        if (variantId) {
            // Variant inventory update
            update.$inc = { 
                'variants.$[elem].inventory': operation === 'add' ? quantity : -quantity 
            };
            logData.variants = [{ variantId, quantity }];
        } else {
            // Main product inventory update
            update.$inc = { 
                inventory: operation === 'add' ? quantity : -quantity 
            };
        }

        const options = {
            new: true,
            arrayFilters: variantId ? [{ 'elem._id': variantId }] : undefined
        };

        const product = await Product.findByIdAndUpdate(
            productId,
            update,
            options
        );

        // Create inventory log
        await InventoryLog.create(logData);

        // Check low stock alerts
        if (variantId) {
            const variant = product.variants.find(v => v._id.equals(variantId));
            if (variant.inventory < product.lowStockThreshold) {
                await this.triggerLowStockAlert(product, variant);
            }
        } else if (product.inventory < product.lowStockThreshold) {
            await this.triggerLowStockAlert(product);
        }

        return product;
    }

    // Upload product images
    async uploadProductImage(productId, file, userId) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new ErrorResponse('Product not found', 404);
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file, {
            folder: `products/${productId}`,
            transformation: { width: 800, height: 800, crop: 'limit' }
        });

        // Update product
        product.images.push({
            url: result.secure_url,
            publicId: result.public_id,
            uploadedBy: userId
        });
        await product.save();

        return product;
    }

    // Generate SKU
    generateSKU(category) {
        const prefix = category.slice(0, 3).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${random}`;
    }

    // Low stock alert
    async triggerLowStockAlert(product, variant = null) {
        const warehouseManagers = await User.find({
            role: 'warehouse',
            notificationPreferences: { $in: ['low_stock'] }
        });

        // Send notifications
        await Promise.all(
            warehouseManagers.map(user => 
                sendEmail({
                    email: user.email,
                    subject: 'Low Stock Alert',
                    template: 'low-stock',
                    context: {
                        productName: product.name,
                        variant: variant?.name,
                        currentStock: variant?.inventory || product.inventory,
                        threshold: product.lowStockThreshold
                    }
                })
            )
        );
    }
}

export default new ProductService();