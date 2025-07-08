/**
 * Image Upload Helper
 * Provides functions for uploading, managing, and displaying images
 */

import { useState, useEffect } from 'react';

const useImageUpload = (context) => {
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Supported image types
    const validImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif'
    ];

    // Maximum file size (5MB)
    const maxFileSize = 5 * 1024 * 1024;

    /**
     * Handles image file selection and upload
     * @param {Event} e - File input change event
     * @param {string} apiEndPoint - API endpoint for upload
     * @param {function} uploadImage - Upload function from API service
     * @param {function} fetchDataFromApi - Data fetching function
     */
    const handleImageUpload = async (e, apiEndPoint, uploadImage, fetchDataFromApi, deleteImages, deleteDataFromApi) => {
        try {
            const files = Array.from(e.target.files || e.dataTransfer?.files || []);

            // Validate files
            const validationError = validateFiles(files);
            if (validationError) {
                context?.showNotification("Error uploading images!", error);
                return false;
            }

            setUploading(true);
            setUploadProgress(0);
            setSelectedImages(files);

            // Prepare form data
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));

            // Upload with progress tracking
            const uploadResponse = await uploadImage(apiEndPoint, formData, {
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            if (!uploadResponse?.success) {
                throw new Error('Image upload failed');
            }

            // Fetch updated image list
            await updateImageList(fetchDataFromApi);

            //Remove images from datbase
            // await removeImageFromDb(fetchDataFromApi, deleteImages, deleteDataFromApi)

            context.showNotification(`${files.length} image(s) uploaded successfully!`, 'success');

            return true;
        } catch (error) {
            console.error('Image upload error:', error);
            context.showNotification('Failed to upload images', 'error');
            return false;
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    /**
     * Validates selected files
     * @param {Array} files - Array of File objects
     * @returns {string|null} Error message or null if valid
     */
    const validateFiles = (files) => {
        if (!files || files.length === 0) {
            return 'No files selected';
        }

        const invalidTypeFiles = files.filter(
            file => !validImageTypes.includes(file.type)
        );

        if (invalidTypeFiles.length > 0) {
            return 'Please select only JPG, PNG, WEBP or GIF image files';
        }

        const oversizedFiles = files.filter(
            file => file.size > maxFileSize
        );

        if (oversizedFiles.length > 0) {
            return `Some files exceed ${maxFileSize / 1024 / 1024}MB limit`;
        }

        return null;
    };

    /**
     * Updates the image list from server
     * @param {function} fetchDataFromApi - Data fetching function
     */
    const updateImageList = async (fetchDataFromApi) => {
        try {
            const response = await fetchDataFromApi('/api/v1/image');
            if (!response || response.length === 0) {
                throw new Error('No images found');
            }
            const images = [];
            const allImages = response.flatMap(item => item.images || []);
            const uniqueImages = [...new Set(allImages)];

            uniqueImages.map((url) => {
                images.push({
                    url: url, 
                    altText: "Product Image"
                })
            })

            setPreviews(images);
        } catch (error) {
            console.error('Failed to update image list:', error);
            throw error;
        }
    };

    const removeImageFromDb = async (fetchDataFromApi, deleteImages, deleteDataFromApi) => {
        fetchDataFromApi('/api/v1/image').then((res) => {
            deleteDataFromApi('/api/v1/image/delete/all');

            // res?.map((item) => {
            //     item?.images?.map((img) => {
            //         deleteImages(`/api/v1/image/delete/cloudinary?img=${img}`).then((res => {
            //             deleteDataFromApi('/api/v1/image/delete/all');
            //         }));
            //     })
            // })
        });
    };

    /**
     * Removes an image from server and state
     * @param {string} imgUrl - URL of image to remove
     * @param {function} deleteImages - Delete function from API service
     */
    const handleRemoveImage = async (imgUrl, deleteImages) => {
        try {
            // Optimistic UI update
            setPreviews(prev => prev.filter(img => img.url !== imgUrl));

            const response = await deleteImages(
                `/api/v1/image/delete/cloudinary?img=${encodeURIComponent(imgUrl)}`
            );

            if (!response?.success) {
                // Revert if deletion failed
                setPreviews(prev => [...prev, imgUrl]);
                throw new Error('Failed to delete image');
            }

            context.showNotification('Image deleted successfully!', 'success');
        } catch (error) {
            console.error('Image deletion error:', error);
            context.showNotification('Failed to delete image', 'error');
        }
    };


    /**
     * Renders image previews
     * @returns {JSX.Element} - Rendered preview components
     */
    const renderImagePreviews = () => (
        <div className="image-preview-container">
            {previews.map((imgUrl, index) => (
                <div key={`${imgUrl}-${index}`} className="image-preview-item">
                    <img 
                        src={imgUrl} 
                        alt={`Preview ${index}`}
                        className="preview-image"
                    />
                    <button 
                        onClick={() => handleRemoveImage(imgUrl)}
                        className="delete-button"
                        disabled={uploading}
                        aria-label="Delete image"
                    >
                        {uploading ? 'Deleting...' : '×'}
                    </button>
                </div>
            ))}
        </div>
    );

    /**
     * Clears all selected images and previews
     */
    const clearImages = () => {
        setPreviews([]);
        setSelectedImages([]);
    };

    return {
        previews,
        setPreviews,
        uploading,
        uploadProgress,
        selectedImages,
        handleImageUpload,
        handleRemoveImage,
        renderImagePreviews,
        clearImages,
        updateImageList
    };
};

export default useImageUpload;