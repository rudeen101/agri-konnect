import React, { useState, useRef } from 'react';
import {
  FaShieldAlt, FaTachometerAlt, FaUsers, FaBox, FaTags,
  FaShoppingCart, FaChartLine, FaCog, FaTimes, FaSave,
  FaCloudUploadAlt
} from 'react-icons/fa';
import "./Category.css"


const AddCategory = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentCategory: '',
    status: true,
    image: null,
    imagePreview: null
  });

  const fileInputRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from category name
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Handle status toggle
  const handleStatusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.checked
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: event.target.result
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.slug) {
      alert('Please fill in all required fields');
      return;
    }

    // In a real application, you would send this data to the server
    console.log('Category Data:', {
      ...formData,
      image: formData.image ? formData.image.name : 'No image'
    });

    // Show success message
    alert('Category created successfully!');
    
    // Reset form
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentCategory: '',
      status: true,
      image: null,
      imagePreview: null
    });
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard this category?')) {
      // In a real app, this would navigate back
      setFormData({
        name: '',
        slug: '',
        description: '',
        parentCategory: '',
        status: true,
        image: null,
        imagePreview: null
      });
    }
  };

  return (
    <div className="dashboard-section">


      {/* Main Content */}
      <div className="">
        <div className="header">
          <h1>Add Category</h1>
        </div>

        <div className="form-container">
          <div className="form-header">
            <h2><FaTags /> Category Information</h2>
          </div>

          <form id="categoryForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="categoryName">Category Name *</label>
                  <input
                    type="text"
                    id="categoryName"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                    required
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="categorySlug">Slug *</label>
                  <input
                    type="text"
                    id="categorySlug"
                    name="slug"
                    className="form-control"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="category-slug"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="categoryDescription">Description</label>
              <textarea
                id="categoryDescription"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description"
              />
            </div>

            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label>Category Image</label>
                  <div 
                    className="image-upload" 
                    onClick={() => fileInputRef.current.click()}
                  >
                    {formData.imagePreview ? (
                      <img 
                        src={formData.imagePreview} 
                        alt="Category preview" 
                        className="image-preview"
                      />
                    ) : (
                      <>
                        <FaCloudUploadAlt className="upload-icon" />
                        <p>Click to upload image</p>
                        <small>JPEG, PNG (Max 2MB)</small>
                      </>
                    )}
                    <input
                      type="file"
                      id="categoryImage"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="parentCategory">Parent Category</label>
                  <select
                    id="parentCategory"
                    name="parentCategory"
                    className="form-control"
                    value={formData.parentCategory}
                    onChange={handleInputChange}
                  >
                    <option value="">None</option>
                    <option value="1">Electronics</option>
                    <option value="2">Clothing</option>
                    <option value="3">Home & Garden</option>
                    <option value="4">Sports</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <div className="status-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        id="categoryStatus"
                        checked={formData.status}
                        onChange={handleStatusChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">
                      {formData.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleCancel}
              >
                <FaTimes /> Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <FaSave /> Save Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};





export default AddCategory;