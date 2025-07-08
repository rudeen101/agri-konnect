import React, { useState, useEffect, useRef } from 'react';
import {   FaCloudUploadAlt, FaTimes, FaEdit } from 'react-icons/fa';
import { MdLibraryAdd } from "react-icons/md";

import './Category.css'
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import Header from "../../../components/layout/Header/Header";
import { fetchDataFromApi, uploadImage, deleteImages, updateDataToApi, deleteDataFromApi, postDataToApi } from '../../../utils/apiCalls';
import { useParams, useNavigate } from "react-router-dom";
import useImageUpload from '../../../hooks/useImageUpload';
import { useAppContext } from '../../../contexts/AppContext'; 



const CreateCategory = () => {
  	// Sample category data (would normally come from API)
	const [formData, setFormData] = useState({
		name: '',
		slug: '',
		parent: '',
		description: '',
		displayOrder: 0,
		isFeatured: false,
		image: {
			url: '',
			publicId: '',
			altText: ''
		},
		seo: {
			title: '',
			metaDescription: '',
			keywords: []
		},
		customFields: {
			showOnHomepage: false,
			homepageOrder: 0,
			specialPromotion: false
		}
	});

	// const [formData, setFormData] = useState({ ...category });
	const [keywordsInput, setKeywordsInput] = useState('');
	const [categories, setCategories] = useState([]);
  
  	const fileInputRef = useRef(null);
	const {id} = useParams();
	const context = useAppContext();
	const navigate = useNavigate();

	    const { 
        previews,
        uploading,
        uploadProgress,
        handleImageUpload,
        handleRemoveImage,
        renderImagePreviews,
		clearImages,

    } = useImageUpload(context);
  
	useEffect(() => {
	// Fetch category data to edit
		const fetchCategoryData = async () => {
			try {
				// Fetch all categories for parent dropdown
				const allCategoriesRes = await fetchDataFromApi('/api/v1/categories');
				const allCategories = allCategoriesRes.data;

        // Get unique parent categories (modified approach)
        const uniqueParentCategories = allCategories
        .filter(cat => cat.parent && typeof cat.parent === 'object') // Filter categories with parent objects
        .map(cat => cat.parent._id) // Get parent IDs
        .filter((parentId, index, self) => self.indexOf(parentId) === index) // Remove duplicates
        .map(parentId => {
          // Find the parent category object
          const parentCategory = allCategories.find(cat => cat._id === parentId);
          return parentCategory ? { _id: parentId, name: parentCategory.name } : null;
        })
        .filter(Boolean); // Remove any null values
				setCategories(uniqueParentCategories);

			} catch (error) {
			console.error('Error fetching data:', error);
			}
		};

		fetchCategoryData();
	}, [id]); // Add id as dependency

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


  // Handle keywords
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && keywordsInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, keywordsInput.trim()]
        }
      }));
      setKeywordsInput('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
		if (previews.length > 0) { formData.image.url = previews[0]; }

      // Prepare the data for API submission
      const submitData = {
        name: formData.name,
        slug: formData.slug,
        parent: formData.parent || null, // Send null if no parent selected
        description: formData.description,
        displayOrder: Number(formData.displayOrder),
        isFeatured: formData.isFeatured,
        image: {
          url: formData.image.url,
          altText: formData.image.altText
        },
        seo: {
          title: formData.seo.title,
          metaDescription: formData.seo.metaDescription,
          keywords: formData.seo.keywords
        },
        customFields: formData.customFields
      };

	  clearImages()

      // Make API call
      const response = await postDataToApi(`/api/v1/categories`, submitData)

      if (response.success) {
        // Show success message
        context.showNotification(`Category created successfully!`, 'success');

		await deleteDataFromApi('/api/v1/image/delete/all');

        
        // Redirect to categories list or do something else
        navigate('/admin/categories'); // If using React Router
      } else {
		context.showNotification(`Couldn't create category, try again!`, 'error');
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error) {
      	console.error('Error submitting category:', error);
		context.showNotification(`Error creating category!`, 'error');

    }
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      console.log('Deleting category:', category._id);
      alert('Category deletion initiated! Check console for details.');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Update slug when name changes
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);

  return (
    <div className="container">
        <Sidebar />
        <div className="main-content">
            <Header />
            <div className="dashboard-section">
                <div className="header">
                    <h1 className="page-title">
                    <MdLibraryAdd className="title-icon" />
                    Create Category
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information Card */}
                    <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">Basic Information</h2>
                      {/* <div className="header-actions">
                          <div className="search-box">
                              <FontAwesomeIcon icon={faSearch} />
                              <input 
                                  type="text" 
                                  placeholder="Search Categories..." 
                                  // value={searchTerm}
                                  // onChange={handleSearch}
                              />
                          </div>
                          <button className="btn btn-primary">
                              <FontAwesomeIcon icon={faPlus} /> <span className="btn-text">Add Category</span>
                          </button>
                      </div> */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Category Name *</label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength="50"
                        />
                        <small className="text-muted">Maximum 50 characters allowed</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="slug" className="form-label">Slug</label>
                        <input
                        type="text"
                        id="slug"
                        name="slug"
                        className="form-control"
                        value={formData.slug}
                        readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="parent" className="form-label">Parent Category</label>
                        <select
                        id="parent"
                        name="parent"
                        className="form-select"
                        value={formData.parent}
                        onChange={handleChange}
                        >
                        <option value="">No parent (root category)</option>
                        {categories.map(cat => ( 
                          <option key={cat?._id} value={cat?._id}>
                          {cat?.name}
                          </option>
                        ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength="500"
                        />
                        <small className="text-muted">Maximum 500 characters allowed</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="displayOrder" className="form-label">Display Order</label>
                        <input
                        type="number"
                        id="displayOrder"
                        name="displayOrder"
                        className="form-control"
                        value={formData.displayOrder}
                        onChange={handleChange}
                        min="0"
                        />
                    </div>

                    <div className="form-group">
                        <div className="form-check">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            name="isFeatured"
                            className="form-check-input"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                        />
                        <label htmlFor="isFeatured" className="form-label">Featured Category</label>
                        </div>
                    </div>
                    </div>

                    {/* Image Upload Card */}
                    <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Category Image</h2>
                    </div>
                    <div 
                        className="image-upload" 
                        onClick={() => fileInputRef.current.click()}
                    >
                        <FaCloudUploadAlt className="upload-icon" />
                        <p>Click to upload or drag and drop</p>
                        <p>Recommended size: 800x800px</p>
                        {/* <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageUpload}
                        /> */}

						<input
							type="file"
							ref={fileInputRef}
							accept="image/*"
							onChange={(e) => handleImageUpload(e, '/api/v1/image/upload', uploadImage, fetchDataFromApi, deleteImages, deleteDataFromApi)}
							style={{ display: 'none' }}
						/>
                    </div>
					<div class="image-preview" id="imagePreview">
						{/* <div class="preview-item">
							<img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500" alt="Product" />
							<div class="preview-remove">
								<i class="fas fa-times"></i>
							</div>
						</div>
						<div class="preview-item">
							<img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500" alt="Product" />
							<div class="preview-remove">
								<i class="fas fa-times"></i>
							</div>
						</div>
						<div class="preview-item">
							<img src="https://images.unsplash.com/photo-1551790625-5e4b8f5c8c6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500" alt="Product" />
							<div class="preview-remove">
								<i class="fas fa-times"></i>
							</div>
						</div> */}

						{
							previews.length > 0 ? (
								<div class="preview-item">
									<img  
										src={ previews[0]} 
										alt="Category preview" 
									/>
									<div class="preview-remove">
										<i class="fas fa-times" onClick={() => handleRemoveImage(previews[0], deleteImages)}></i>
									</div>
								</div>
							) : (
								formData?.image?.url ?
								<div class="preview-item">
									<img  
										src={formData?.image?.url} 
										alt="Category preview" 
									/>
									<div class="preview-remove">
										<i class="fas fa-times" onClick={()=> handleRemoveImage(previews[0], deleteImages)}></i>
									</div>
								</div>
								:
								<div>No image selected</div>
							)
						}
					</div>
	
                    
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label htmlFor="altText" className="form-label">Image Alt Text</label>
                        <input
                        type="text"
                        id="altText"
                        name="altText"
                        className="form-control"
                        value={formData?.image?.altText}
                        onChange={(e) => handleNestedChange('image', 'altText', e.target.value)}
                        />
                    </div>
                    </div>

                    {/* SEO Settings Card */}
                    <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">SEO Settings</h2>
                    </div>
                    <div className="seo-fields">
                        <div className="form-group">
                        <label htmlFor="seoTitle" className="form-label">SEO Title</label>
                        <input
                            type="text"
                            id="seoTitle"
                            name="seoTitle"
                            className="form-control"
                            value={formData?.seo?.title}
                            onChange={(e) => handleNestedChange('seo', 'title', e.target.value)}
                        />
                        </div>

                        <div className="form-group">
                        <label htmlFor="metaDescription" className="form-label">Meta Description</label>
                        <textarea
                            id="metaDescription"
                            name="metaDescription"
                            className="form-control"
                            value={formData?.seo?.metaDescription}
                            onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                        />
                        </div>

                        <div className="form-group">
                        <label htmlFor="keywords" className="form-label">Keywords</label>
                        <input
                            type="text"
                            id="keywords"
                            className="form-control"
                            placeholder="Add keywords and press Enter"
                            value={keywordsInput}
                            onChange={(e) => setKeywordsInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="keywords-container">
                            {formData?.seo?.keywords.map((keyword, index) => (
                            <div key={index} className="keyword-tag">
                                {keyword}
                                <FaTimes 
                                className="keyword-remove" 
                                onClick={() => removeKeyword(index)}
                                />
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Advanced Settings Card */}
                    <div className="card">
                      <div className="card-header">
                          <h2 className="card-title">Advanced Settings</h2>
                      </div>
                      <div className="form-group">
                          <label htmlFor="customFields" className="form-label">Custom Fields (JSON)</label>
                          <textarea
                          id="customFields"
                          name="customFields"
                          className="form-control"
                          value={JSON.stringify(formData.customFields, null, 2)}
                          onChange={(e) => {
                              try {
                              const parsed = JSON.parse(e.target.value);
                              setFormData(prev => ({ ...prev, customFields: parsed }));
                              } catch (err) {
                              // Handle JSON parse error if needed
                              }
                          }}
                          />
                      </div>

                      <div class="form-actions ">
                        <button type="button" class="btn btn-outline" id="cancelBtn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" onClick={handleSubmit}>
                            <i class="fas fa-save"></i> Update Category
                        </button>
                      </div>
                    </div>
           
                </form>
           </div>
        </div>
    </div>
  );
};

export default CreateCategory;