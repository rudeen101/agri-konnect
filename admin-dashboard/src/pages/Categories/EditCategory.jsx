import React, { useState, useRef } from 'react';
import {
  FaShieldAlt, FaTachometerAlt, FaUsers, FaBox, FaTags,
  FaShoppingCart, FaChartLine, FaCog, FaTrash, FaTimes,
  FaSave, FaCloudUploadAlt, FaExclamationTriangle
} from 'react-icons/fa';
import "./Category.css"


const EditCategory = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: 'Electronics',
    slug: 'electronics',
    description: 'All electronic devices including smartphones, laptops, TVs, and home appliances.',
    parentCategory: '1',
    status: true,
    image: null,
    imagePreview: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500'
  });

  // UI state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  // Stats data
  const stats = [
    { title: 'Total Products', value: '124' },
    { title: 'Active Products', value: '112' },
    { title: 'Last Updated', value: '2 days ago' }
  ];

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
    console.log('Updated Category Data:', {
      ...formData,
      image: formData.image ? formData.image.name : 'Using existing image'
    });

    // Show success message
    alert('Category updated successfully!');
  };

  // Handle delete confirmation
  const handleDelete = () => {
    // In a real app, this would make an API call to delete the category
    console.log('Category deleted');
    alert('Category deleted successfully!');
    setShowDeleteModal(false);
    // Redirect to categories list would happen here
  };

  // Handle cancel confirmation
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      // In a real app, this would navigate back or reset the form
      console.log('Changes discarded');
    }
  };

  return (
    <div className="dashboard-section">

      {/* Main Content */}
      <div className="">
        <div className="header">
          <h1>Edit Category</h1>
          <div className="header-actions">
            <button 
              className="btn btn-danger" 
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTrash /> Delete Category
            </button>
          </div>
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
                    <img 
                      src={formData.imagePreview} 
                      alt="Category preview" 
                      className="image-preview"
                    />
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
                <FaSave /> Update Category
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <div className="modal-header">
              <h3><FaExclamationTriangle /> Delete Category</h3>
              <button 
                className="close-sidebar"
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                Are you sure you want to delete the "{formData.name}" category? This will also remove all subcategories and products.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCategory;