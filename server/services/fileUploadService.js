// services/fileUploadService.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(
            'public/uploads',
            file.fieldname,
            req.user.id
        );
        
        // Create directory if not exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    cb(null, allowedTypes.includes(file.mimetype));
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5 // Max 5 files
    }
});

// Advanced features
export const processUpload = async (file, transformations = {}) => {
    // Implement image processing, PDF extraction, etc.
    // Example using Sharp for images:
    if (file.mimetype.startsWith('image/')) {
        const sharp = require('sharp');
        await sharp(file.path)
            .resize(transformations.width || 800)
            .toFormat('jpeg', { quality: 80 })
            .toFile(`${file.path}-processed.jpg`);
    }
};