import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, faTachometerAlt, faUsers, faBox, faShoppingCart, 
    faChartLine, faCog, faSearch, faPlus, faEllipsisH, 
    faEye, faEdit, faTrash, faChevronLeft, faChevronRight, 
    faTimes, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import '../../Index.css'; 
import './Product.css'
import { fetchDataFromApi } from '../../../utils/apiCalls'; 
import { Link } from 'react-router-dom';
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import Header from "../../../components/layout/Header/Header";
import {dateFormater} from "../../../utils/helpers"

const Product = () => {
    // Sample user data
    const [categories, setCategories] = useState([]);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    
    const actionMenuRefs = useRef({});
    const sidebarRef = useRef(null);
    const deleteModalRef = useRef(null);

    useEffect(() => {
    // Fetch user data from API
        fetchDataFromApi('/api/v1/product').then((res) =>{
            setCategories(res.data);
       
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close action menus if clicked outside
            if (activeMenuId && !actionMenuRefs.current[activeMenuId]?.contains(event.target)) {
                setActiveMenuId(null);
            }

            // Close sidebar if clicked outside
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }

            // Close delete modal if clicked outside
            if (deleteModalOpen && deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
                setDeleteModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenuId, sidebarOpen, deleteModalOpen]);

    const toggleActionMenu = (id) => {
          console.log("toggle", id)
        console.log("activeMenuId", activeMenuId)
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const viewUser = (id) => {
        setCurrentProductId(id);
        setSidebarOpen(true);
        setActiveMenuId(null);
    };


    const showDeleteModal = (id) => {
        setCategoryToDeleteId(id);
        setDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const hideDeleteModal = () => {
        setDeleteModalOpen(false);
        setCategoryToDeleteId(null);
    };

    const confirmDelete = () => {
        if (categoryToDeleteId) {
            // In a real application, you would make an API call here
            console.log(`Deleting user with ID: ${categoryToDeleteId}`);
            alert(`User with ID: ${categoryToDeleteId} has been deleted`);
            
            // Close modals and reset state
            hideDeleteModal();
            setSidebarOpen(false);
            setCategoryToDeleteId(null);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Filter categories based on search term
    const filteredProducts = Object.entries(categories).filter(([id, user]) => {
        if (!searchTerm) return true;
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.id.toLowerCase().includes(searchTerm) ||
            user.region.toLowerCase().includes(searchTerm)
        );
    });

    console.log("filteredProducts", filteredProducts)

    const currentProduct = currentProductId ? categories[currentProductId] : null;
    const userToDelete = categoryToDeleteId ? categories[categoryToDeleteId] : null;

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="dashboard-section">

                    {/* Main Content */}
                    <div className={`${sidebarOpen ? 'sidebar-open' : ''}`}>
                        <div className="header">
                            <h1>Product</h1>
                        </div>

                        <div className="table-container">
                            <div className="table-header">
                                <div className="table-title">Product List</div>
                                <div className="header-actions">
                                    <div className="search-box">
                                        <FontAwesomeIcon icon={faSearch} />
                                        <input 
                                            type="text" 
                                            placeholder="Search Categories..." 
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <Link to={"/admin/create-product"}>
                                        <button className="btn btn-primary">
                                            <FontAwesomeIcon icon={faPlus} /> <span className="btn-text">Add Product</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="desktop-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="checkbox-cell"><input type="checkbox" /></th>
                                            <th>Product</th>
                                            <th>ID</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(([id, product]) => (
                                            <tr key={id}>
                                                <td className="checkbox-cell"><input type="checkbox" /></td>
                                                <td>
                                                    <div className="user-cell">
                                                        <img src={product?.images[0]?.url} alt="product" className="user-avatar" />
                                                        <div className="user-info">
                                                            <div className="user-name">{product?.name}</div>
                                                            {/* <div className="user-email">{product?.slug}</div> */}

                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product?.id}</td>
                                                <td>{product?.category.name}</td>
                                                <td>{product?.price}</td>
                                                <td>{product?.inventory}</td>
                                                <td className="action-cell">
                                                    <button 
                                                        className="action-btn" 
                                                        onClick={() => toggleActionMenu(id)}
                                                    >
                                                        <FontAwesomeIcon icon={faEllipsisH} />
                                                    </button>
                                                    <div 
                                                        className={`action-menu ${activeMenuId === id ? 'active' : ''}`}
                                                        ref={el => actionMenuRefs.current[id] = el}
                                                    >
                                                        <button className="view" onClick={() => viewUser(id)}>
                                                            <FontAwesomeIcon icon={faEye} /> View
                                                        </button>
                                                        <Link to={`/admin/update-product/${product?.id}`}>
                                                            <button className="edit">
                                                            <FontAwesomeIcon icon={faEdit} /> Edit
                                                        </button>
                                                        </Link>
                                                        
                                                    
                                                        <button className="delete" onClick={() => showDeleteModal(id)}>
                                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="mobile-cards">
                                {filteredProducts.map(([id, product]) => (
                                    <div className="user-card" key={`mobile-${id}`}>
                                        <div className="card-header">
                                            <div className="checkbox-cell"><input type="checkbox" /></div>
                                            <div className="user-info">
                                                <img src={product?.images[0]?.url} alt="User" className="user-avatar" />
                                                <div>
                                                    <div className="user-name">{product?.name}</div>
                                                </div>
                                            </div>
                                            <button 
                                                className="action-btn" 
                                                onClick={() => toggleActionMenu(`mobile-${id}`)}
                                            >
                                                <FontAwesomeIcon icon={faEllipsisH} />
                                            </button>
                                            <div 
                                                className={`action-menu ${activeMenuId === `mobile-${id}` ? 'active' : ''}`}
                                                ref={el => actionMenuRefs.current[`mobile-${id}`] = el}
                                            >
                                                <button className="view" onClick={() => viewUser(id)}>
                                                    <FontAwesomeIcon icon={faEye} /> View
                                                </button>

                                                <Link to={`/admin/update-product/${product?.id}`}>
                                                    <button className="edit">
                                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                                    </button>
                                                </Link>
                                                <button className="delete" onClick={() => showDeleteModal(id)}>
                                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-details">
                                            <div className="detail-row">
                                                <span className="detail-label">ID:</span>
                                                <span className="detail-value">{product?.id}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Category:</span>
                                                <span className="detail-value">{product?.category?.name}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Price:</span>
                                                <span className="detail-value">{product?.Price}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Stock:</span>
                                                <span className="detail-value">{product?.inventory}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="table-footer">
                                <div>Showing 1 to {filteredProducts.length} of {filteredProducts.length} entries</div>
                                <div className="pagination">
                                    <button><FontAwesomeIcon icon={faChevronLeft} /></button>
                                    <button className="active">1</button>
                                    <button>2</button>
                                    <button>3</button>
                                    <button>4</button>
                                    <button>5</button>
                                    <button><FontAwesomeIcon icon={faChevronRight} /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* product Detail Sidebar */}
                    <div className={`detail-sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                        {currentProduct && (
                            <>
                                <div className="sidebar-header">
                                    <h3>Product Details</h3>
                                    <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className="user-detail">
                                    <div className="user-header">
                                        <img src={currentProduct?.images[0]?.url} alt="User" className="user-avatar" />
                                        <div className="user-info">
                                            <h4>{currentProduct?.name }</h4>
                                            {/* <p>{currentProduct?.slug }</p> */}
                                            <span className={`user-status status-active`}>
                                                {currentProduct?.isActive ? "Active" : "Inactive"} 
                                            </span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Basic Information</h5>
                                        <div className="detail-row">
                                            <div className="detail-label">Product ID:</div>
                                            <div className="detail-value">{currentProduct?.id}</div>
                                        </div>
                                        {
                                            currentProduct?.parent && 
                                            <div className="detail-row">
                                                <div className="detail-label">Category:</div>
                                                <div className="detail-value">{currentProduct?.category?.name}</div>
                                            </div>
                                        }

                                          <div className="detail-row">
                                            <div className="detail-label">Base Price:</div>
                                            <div className="detail-value">{currentProduct?.basePrice}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Price:</div>
                                            <div className="detail-value">{currentProduct?.price}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Stock:</div>
                                            <div className="detail-value">{currentProduct?.inventory}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">MOQ:</div>
                                            <div className="detail-value">{currentProduct?.minOrder}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Packaging Type:</div>
                                            <div className="detail-value">{currentProduct?.packagingType[0]}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Delivery Day(s):</div>
                                            <div className="detail-value">{currentProduct?.estimatedDeliveryDate}</div>
                                        </div>
                                    
                                        <div className="detail-row">
                                            <div className="detail-label">Status</div>
                                            <div className="detail-value">{currentProduct?.isActive ? "Active" : "Inactive"}</div>
                                        </div>
                                    </div>

                                       <div className="detail-section">
                                        <h5>Product Specifications</h5>
                                        <div className="detail-row">
                                            <table class="spec-table">
                                                <tbody>
                                                    {
                                                        currentProduct?.specifications.length > 0 && currentProduct?.specifications?.map((product) => { return (
                                                            <tr>
                                                                <th>{product?.key}</th>
                                                                <td>{product?.value}</td>
                                                            </tr>
                                                        )})
                                                    }
                                           
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Desscription</h5>
                                        <div className="detail-row">
                                            {/* <div className="detail-label">Notes</div> */}
                                            <div className="detail-value">{currentProduct?.description}</div>
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <Link to={`/admin/update-product/${currentProduct?.id}`}>
                                            <button className="btn btn-primary" >
                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                            </button>
                                        </Link>
                                        <Link>
                                            <button className="btn btn-danger" onClick={() => setSidebarOpen(false)}>
                                                <FontAwesomeIcon icon={faTimes} /> Close
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Delete Confirmation Modal */}
                    <div className={`modal-overlay ${deleteModalOpen ? 'active' : ''}`}>
                        <div className="modal" ref={deleteModalRef}>
                            <div className="modal-header">
                                <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Delete user</h3>
                                <button className="close-sidebar" onClick={hideDeleteModal}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <p className="modal-message">
                                    {userToDelete ? 
                                        `Are you sure you want to delete category ${categoryToDelete?.name} (${categoryToDelete?.id})? This action cannot be undone.` : 
                                        'Are you sure you want to delete this user? This action cannot be undone.'}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline" onClick={hideDeleteModal}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger" onClick={confirmDelete}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;