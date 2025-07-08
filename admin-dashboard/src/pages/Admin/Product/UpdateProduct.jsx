import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCubes, faTachometerAlt, faList, faBox, faUsers, faCog, 
  faTimes, faSave, faCloudUploadAlt, faPlus 
} from '@fortawesome/free-solid-svg-icons';
import "./Product.css";
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import Header from "../../../components/layout/Header/Header";
import { fetchDataFromApi, uploadImage, deleteImages, updateDataToApi, deleteDataFromApi, postDataToApi } from '../../../utils/apiCalls';
import useImageUpload from '../../../hooks/useImageUpload';
import { useAppContext } from '../../../contexts/AppContext'; 


const UpdateProduct = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    // brand: '',
    basePrice: 0,
    price: 0,
    inventory: 0,
    lowStockThreshold: 10,
    minOrder: 0,
    isFeatured: false,
    isTopSeller: false,
    isPopular: false,
    isRecommended: false,
    isActive: true,
    packagingType: [],
    estimatedDeliveryDate: 0,
    specifications: [{ key: '', value: '', unit: '' }],
    tags: [],
    images: []
  });

  const [parentCateories, setParentCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [productImages, setProductImages] = useState([])

  const fileInputRef = useRef(null);

  const context = useAppContext();
  const navigate = useNavigate();
  const {id} = useParams();


  const { 
    previews,
    setPreviews,
    uploading,
    uploadProgress,
    handleImageUpload,
    handleRemoveImage,
    renderImagePreviews,
    clearImages,

  } = useImageUpload(context);

  //clear unsaved user profile images from the database and cloudinary upon refresh
  useEffect(() => {
    const FetchDeleteImages = async() => {
      const response = await fetchDataFromApi('/api/v1/image');
      response?.map((item) => {
        item?.images?.map((img) => {
          deleteImages(`/api/v1/image/delete/cloudinary?img=${img}`).then((res => {
          }));
        })
      })

      await deleteDataFromApi('/api/v1/image/delete/all');
    }
    FetchDeleteImages()
  }, []);

  useEffect(() => {
  // Fetch category data to edit
    const fetchCategoryData = async () => {
      try {
        // Fetch the current category data
        const product = await fetchDataFromApi(`/api/v1/product/${id}`);

        // Fetch all categories for parent dropdown
        // Remove any null values

        setFormData({
          name: product.data.name,
          description: product.data.description,
          category: product.data.category.id,
          // brand: '',
          basePrice: product.data.basePrice,
          price: parseFloat(product.data.price),
          inventory: product.data.inventory,
          lowStockThreshold: product.data.lowStockThreshold,
          minOrder: product.data.minOrder,
          isFeatured: product.data.isFeatured,
          isTopSeller: product.data.isTopSeller,
          isPopular: product.data.isPopular,
          isRecommended: product.data.isRecommended,
          isActive: product.data.isActive,
          packagingType: product.data.packagingType,
          estimatedDeliveryDate: product.data.estimatedDeliveryDate,
          specifications: product.data.specifications,
          tags: product.data.tags,
          images: product.data.images
        });

        setPreviews(product.data.images);

      } catch (error) {
      console.error('Error fetching data:', error);
      }
    };

    fetchCategoryData();
  }, [id]); 

  useEffect(() => {
    previews?.map((img) => {
      productImages.push({
        url: img
      })
    })
  }, [previews]);

  useEffect(() => {
  // Fetch category data to edit
    const fetchCategoryData = async () => {
      try {
        // Fetch the current category data
        const categories = await fetchDataFromApi(`/api/v1/categories`);

          // Separate parents and subcategories
        const parents = [];
        const childrenCategories = [];

        categories.data.forEach(category => {
            if (!category.parent) {
                // It's a parent category
                parents.push(category);
            } else {
                // It's a subcategory
                childrenCategories.push(category);
            }
        });

        setParentCategories(parents)
        setSubCategories(childrenCategories)

      } catch (error) {
      console.error('Error fetching data:', error);
      }
    };

    fetchCategoryData();
  }, []); // Add id as dependency
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle select multiple changes
  const handleSelectMultiple = (e) => {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      packagingType: options
    }));
  };


  // Remove image
  const handleDeleteImage = async(img) => {
    
      try {
        await deleteImages(`/api/v1/product/image?img=${img.url}`)

        handleRemoveImage(img.url, deleteImages)
      } catch (error) {
        console.error('Error fetching data:', error);
      }

  };

  // Set primary image
  // const setPrimaryImage = (index) => {
  //   const newImages = previews.map((img, i) => ({
  //     ...img,
  //     isPrimary: i === index
  //   }));
  //   // setPreviewImages(newImages);
  // };

  // Add specification
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '', unit: '' }]
    }));
  };

  // Update specification
  const updateSpecification = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };

  // Remove specification
  const removeSpecification = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };

  // Add tag
  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tagText = e.target.value.trim().replace(',', '');
      if (tagText && !formData.tags.includes(tagText)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagText]
        }));
        e.target.value = '';
      }
    }
  };

  // Remove tag
  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Prepare final form data with images
    const finalFormData = {
      ...formData,
      images: previews.map(img => ({
        url: img.url,
        altText: img.altText
        // isPrimary: img.isPrimary
      }))
    };

    const response = await updateDataToApi(`/api/v1/product/${id}`, finalFormData)

    if (response.success) {
      // Show success message
      context.showNotification(`Product updated successfully!`, 'success');

      await deleteDataFromApi('/api/v1/image/delete/all');

      // Redirect to product list 
      navigate('/admin/products'); // If using React Router
    } else {
      context.showNotification(`Couldn't update product, try again!`, 'error');
      throw new Error(response.message || 'Operation failed');
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
          <Header />
          <div className="dashboard-section">
            <div className="header">
              <h1 className="page-title">Update Product</h1>
            </div>

            <form id="productForm">
              {/* Basic Information Card */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Basic Information</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Product Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="form-control" 
                    placeholder="Enter product name" 
                    required 
                    maxLength="100"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea 
                    id="description" 
                    name="description"
                    className="form-control" 
                    placeholder="Enter product description" 
                    required 
                    maxLength="2000"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category *</label>
                  <select 
                    id="category" 
                    name="category"
                    className="form-select" 
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {
                      subCategories?.length > 0 && subCategories?.map((category) => (
                        <option value={category?.id}>{category?.name}</option>
                      ))
                    }
                    {/* <option value="1">Electronics</option>
                    <option value="2">Clothing</option>
                    <option value="3">Home & Garden</option> */}
                  </select>
                </div>

                {/* <div className="form-group">
                  <label htmlFor="brand" className="form-label">Sub Categories</label>
                  <select 
                    id="brand" 
                    name="brand"
                    className="form-select"
                    value={formData.brand}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a brand</option>
                    <option value="1">Apple</option>
                    <option value="2">Samsung</option>
                    <option value="3">Nike</option>
                  </select>
                </div> */}
              </div>

              {/* Pricing & Inventory Card */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Pricing & Inventory</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="basePrice" className="form-label">Base Price *</label>
                  <input 
                    type="number" 
                    id="basePrice" 
                    name="basePrice"
                    className="form-control" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    required
                    value={formData.basePrice}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label">Selling Price *</label>
                  <input 
                    type="number" 
                    id="price" 
                    name="price"
                    className="form-control" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inventory" className="form-label">Inventory Quantity</label>
                  <input 
                    type="number" 
                    id="inventory" 
                    name="inventory"
                    className="form-control" 
                    placeholder="0" 
                    min="0" 
                    value={formData.inventory}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lowStockThreshold" className="form-label">Low Stock Threshold</label>
                  <input 
                    type="number" 
                    id="lowStockThreshold" 
                    name="lowStockThreshold"
                    className="form-control" 
                    placeholder="10" 
                    min="0" 
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="minOrder" className="form-label">Minimum Order Quantity</label>
                  <input 
                    type="number" 
                    id="minOrder" 
                    name="minOrder"
                    className="form-control" 
                    placeholder="0" 
                    min="0" 
                    value={formData.minOrder}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Product Images Card */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Product Images</h2>
                </div>
                <div 
                  className="image-upload" 
                  onClick={() => fileInputRef.current.click()}
                >
                  <FontAwesomeIcon icon={faCloudUploadAlt} />
                  <p>Click to upload or drag and drop</p>
                  <p>Recommended size: 800x800px</p>
                  {/* <input 
                    type="file" 
                    id="imageInput" 
                    ref={fileInputRef}
                    accept="image/*" 
                    multiple 
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  /> */}

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple 
                    onChange={(e) => handleImageUpload(e, '/api/v1/image/upload', uploadImage, fetchDataFromApi, deleteImages, deleteDataFromApi)}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="image-preview-container">
                  {
                    previews?.length > 0 && previews?.map((img, index) => (
                        <div 
                          key={index} 
                          className="image-preview-item"
                        >
                          <img src={img.url} alt={`Preview ${index}`} />
                          <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => { handleDeleteImage(img) }}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                    ))
                  //   :
                  //   formData?.images?.map((img, index) => (
                  //     <div 
                  //       key={index} 
                  //       className="image-preview-item"
                  //     >
                  //       <img src={img?.url} alt={`Preview ${index}`} />
                  //       <button 
                  //         type="button" 
                  //         className="remove-btn"
                  //         onClick={(e) => {
                  //           e.stopPropagation();
                  //           handleRemoveImage(img, deleteImages)
                  //         }}
                  //       >
                  //         <FontAwesomeIcon icon={faTimes} />
                  //       </button>
                  //     </div>
                  //   ))        
                  }
                </div>
              </div>

              {/* Specifications Card */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Specifications</h2>
                </div>
                <div className="specifications-container">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="specification-item">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Key (e.g., Color)"
                        value={spec.key}
                        onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Value (e.g., Black)"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Unit (optional)"
                        value={spec.unit}
                        onChange={(e) => updateSpecification(index, 'unit', e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="spec-btn btn-danger"
                        onClick={() => removeSpecification(index)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="spec-btn btn-primary add-specification"
                  onClick={addSpecification}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Specification
                </button>
              </div>

              {/* Tags Card */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Tags</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="tags" className="form-label">Product Tags</label>
                  <input 
                    type="text" 
                    id="tags" 
                    className="form-control" 
                    placeholder="Add tags separated by commas"
                    onKeyDown={addTag}
                  />
                  <div className="tags-container">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="tag">
                        {tag}
                        <i 
                          className="fas fa-times"
                          onClick={() => removeTag(index)}
                        ></i>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Flags Card */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Product Flags</h2>
                </div>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        name="isFeatured"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Featured Product</span>
                  </div>
                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="isTopSeller"
                        checked={formData.isTopSeller}
                        onChange={handleInputChange}
                        name="isTopSeller"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Top Seller</span>
                  </div>
                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="isPopular"
                        checked={formData.isPopular}
                        onChange={handleInputChange}
                        name="isPopular"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Popular</span>
                  </div>
                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="isRecommended"
                        checked={formData.isRecommended}
                        onChange={handleInputChange}
                        name="isRecommended"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Recommended</span>
                  </div>
                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        id="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        name="isActive"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Active</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Packaging Card */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Shipping & Packaging</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="packagingType" className="form-label">Packaging Type</label>
                  <select 
                    id="packagingType" 
                    className="form-select" 
                    multiple
                    value={formData.packagingType}
                    onChange={handleSelectMultiple}
                  >
                    <option value="Bag">Bag</option>
                    <option value="Crate">Crate</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Box">Box</option>
                    <option value="Basket">Basket</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="estimatedDeliveryDate" className="form-label">Estimated Delivery (Days)</label>
                  <input 
                    type="number" 
                    id="estimatedDeliveryDate" 
                    name="estimatedDeliveryDate"
                    className="form-control" 
                    placeholder="0" 
                    min="0" 
                    value={formData.estimatedDeliveryDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-actions ">
                  <button type="button" className="btn btn-outline" id="cancelBtn">
                      <i className="fas fa-times"></i> Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                      <i className="fas fa-save"></i> Update Product
                  </button>
                </div>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
};

export default UpdateProduct;