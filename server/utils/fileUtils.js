// utils/fileUtils.js
import fs from 'fs/promises';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import crypto from 'crypto';

export class FileManager {
    constructor(basePath = 'public/uploads') {
        this.basePath = path.resolve(basePath);
    }

    async saveFile(fileData, directory = 'temp') {
        const dirPath = path.join(this.basePath, directory);
        await fs.mkdir(dirPath, { recursive: true });
        
        const filePath = path.join(dirPath, fileData.originalname);
        await fs.writeFile(filePath, fileData.buffer);
        
        return {
            path: filePath,
            size: fileData.size,
            mimetype: fileData.mimetype,
            hash: await this.generateFileHash(filePath)
        };
    }

    async generateFileHash(filePath) {
        const hash = crypto.createHash('sha256');
        const stream = createReadStream(filePath);
        
        return new Promise((resolve, reject) => {
            stream.on('data', chunk => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }

    async moveFile(source, destination) {
        const destPath = path.join(this.basePath, destination);
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.rename(source, destPath);
        return destPath;
    }

    async deleteFile(filePath) {
        const fullPath = path.join(this.basePath, filePath);
        await fs.unlink(fullPath);
        
        // Clean up empty directories
        let dir = path.dirname(fullPath);
        while (dir !== this.basePath) {
            try {
                await fs.rmdir(dir);
                dir = path.dirname(dir);
            } catch {
                break; // Directory not empty
            }
        }
    }

    async listFiles(directory, options = {}) {
        const { recursive = false, filter = () => true } = options;
        const dirPath = path.join(this.basePath, directory);
        
        const walk = async (currentPath) => {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            const results = [];
            
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                const relativePath = path.relative(this.basePath, fullPath);
                
                if (entry.isDirectory() && recursive) {
                    results.push(...await walk(fullPath));
                } else if (entry.isFile() && filter(relativePath)) {
                    const stats = await fs.stat(fullPath);
                    results.push({
                        path: relativePath,
                        size: stats.size,
                        modified: stats.mtime,
                        created: stats.birthtime
                    });
                }
            }
            
            return results;
        };
        
        return walk(dirPath);
    }
}