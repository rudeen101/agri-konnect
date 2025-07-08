import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import fs from 'fs';
import path from 'path';
import { CLOUDINARY_CONFIG } from '../config/environment.js';
import ErrorResponse from '../utils/errorResponse.js';

class StorageService {
  constructor() {
    cloudinary.config(CLOUDINARY_CONFIG);
  }

  // Upload from buffer
  async uploadBuffer(buffer, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          ...options
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  // Upload from file path
  async uploadFile(filePath, options = {}) {
    if (!fs.existsSync(filePath)) {
      throw new ErrorResponse('File not found', 404);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      ...options
    });

    // Clean up temp file
    fs.unlinkSync(filePath);

    return result;
  }

  // Delete asset
  async deleteAsset(publicId, options = {}) {
    return cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      ...options
    });
  }

  // Generate secure upload signature
  generateUploadSignature(folder, publicId = null) {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        public_id: publicId,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
      },
      process.env.CLOUDINARY_SECRET
    );

    return {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_KEY
    };
  }

  // Generate responsive image URL
  generateImageUrl(publicId, transformations = {}) {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      ...transformations
    });
  }

  // Batch delete assets
  async bulkDeleteAssets(publicIds) {
    return cloudinary.api.delete_resources(publicIds, {
      invalidate: true
    });
  }

  // PDF thumbnail generation
  async generatePdfThumbnail(publicId) {
    return cloudinary.url(publicId, {
      format: 'jpg',
      page: 1,
      transformation: [
        { width: 300, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });
  }
}

export default new StorageService();