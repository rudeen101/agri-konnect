// jobs/cleanupUploads.js
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = 'public/uploads/temp';

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
    console.log('Running uploads cleanup job...');

    try {
        const now = new Date();
        const files = await fs.readdir(UPLOAD_DIR);

        for (const file of files) {
            const filePath = path.join(UPLOAD_DIR, file);
            const stats = await fs.stat(filePath);
            const fileAge = (now - stats.mtime) / (1000 * 60 * 60); // Hours

            if (fileAge > 24) { // Delete files older than 24 hours
                await fs.unlink(filePath);
                console.log(`Deleted expired temp file: ${file}`);
            }
        }

        // Clean empty directories
        await cleanEmptyDirectories(UPLOAD_DIR);
    } catch (err) {
        console.error('Cleanup job failed:', err);
    }
});

async function cleanEmptyDirectories(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    if (entries.length === 0) {
        await fs.rmdir(dir);
        return;
    }

    for (const entry of entries) {
        if (entry.isDirectory()) {
            await cleanEmptyDirectories(path.join(dir, entry.name));
        }
    }

    // Check again after cleaning subdirectories
    const remaining = await fs.readdir(dir);
    if (remaining.length === 0) {
        await fs.rmdir(dir);
    }
}