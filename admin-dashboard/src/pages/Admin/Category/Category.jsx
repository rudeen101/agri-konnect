import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, faTachometerAlt, faUsers, faBox, faShoppingCart, 
    faChartLine, faCog, faSearch, faPlus, faEllipsisH, 
    faEye, faEdit, faTrash, faChevronLeft, faChevronRight, 
    faTimes, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import '../../Index.css'; 
import './Category.css'
import { fetchDataFromApi } from '../../../utils/apiCalls'; 
import { Link } from 'react-router-dom';
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import Header from "../../../components/layout/Header/Header";
import {dateFormater} from "../../../utils/helpers"

const Category = () => {
    // Sample user data
    const [categories, setCategories] = useState([]);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
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
        fetchDataFromApi('/api/v1/categories').then((res) =>{
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
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const viewUser = (id) => {
        setCurrentCategoryId(id);
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
    const filteredCategories = Object.entries(categories).filter(([id, user]) => {
        if (!searchTerm) return true;
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.id.toLowerCase().includes(searchTerm) ||
            user.region.toLowerCase().includes(searchTerm)
        );
    });

    const currentCategory = currentCategoryId ? categories[currentCategoryId] : null;
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
                            <h1>Category</h1>
                        </div>

                        <div className="table-container">
                            <div className="table-header">
                                <div className="table-title">User List</div>
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
                                    <Link to={"/admin/create-category"}>
                                        <button className="btn btn-primary">
                                            <FontAwesomeIcon icon={faPlus} /> <span className="btn-text">Add Category</span>
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
                                            <th>Category</th>
                                            <th>ID</th>
                                            <th>Parent Category</th>
                                            <th>Products</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCategories.map(([id, category]) => (
                                            <tr key={id}>
                                                <td className="checkbox-cell"><input type="checkbox" /></td>
                                                <td>
                                                    <div className="user-cell">
                                                        <img src={category?.image?.url} alt="Category" className="user-avatar" />
                                                        <div className="user-info">
                                                            <div className="user-name">{category?.name}</div>
                                                            <div className="user-email">{category?.slug}</div>

                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{category?.id}</td>
                                                <td>{category?.parent?.name ? category?.parent?.name : "--"}</td>
                                                <td>{category.productCount}</td>
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
                                                        <Link to={`/admin/update-category/${category?.id}`}>
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
                                {filteredCategories.map(([id, category]) => (
                                    <div className="user-card" key={`mobile-${id}`}>
                                        <div className="card-header">
                                            <div className="checkbox-cell"><input type="checkbox" /></div>
                                            <div className="user-info">
                                                <img src={category?.image?.url} alt="User" className="user-avatar" />
                                                <div>
                                                    <div className="user-name">{category?.name}</div>
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

                                                <Link to={`/admin/update-category/${category?.id}`}>
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
                                                <span className="detail-value">{category?.id}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Parent Category:</span>
                                                <span className="detail-value">{category?.parent?.name ? category?.parent?.name : "--"}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Products:</span>
                                                <span className="detail-value">{category?.productCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="table-footer">
                                <div>Showing 1 to {filteredCategories.length} of {filteredCategories.length} entries</div>
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

                    {/* Category Detail Sidebar */}
                    <div className={`detail-sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                        {currentCategory && (
                            <>
                                <div className="sidebar-header">
                                    <h3>Category Details</h3>
                                    <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className="user-detail">
                                    <div className="user-header">
                                        <img src={currentCategory?.image?.url} alt="User" className="user-avatar" />
                                        <div className="user-info">
                                            <h4>{currentCategory?.name }</h4>
                                            <p>{currentCategory?.slug }</p>
                                            <span className={`user-status status-active`}>
                                                {/* {currentUser.status} */} Active
                                            </span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Basic Information</h5>
                                        <div className="detail-row">
                                            <div className="detail-label">Category ID</div>
                                            <div className="detail-value">{currentCategory?.id}</div>
                                        </div>
                                        {
                                            currentCategory?.parent && 
                                            <div className="detail-row">
                                                <div className="detail-label">Parent Category</div>
                                                <div className="detail-value">{currentCategory?.parent?.name}</div>
                                            </div>
                                        }

                                        <div className="detail-row">
                                            <div className="detail-label">Products</div>
                                            <div className="detail-value">{currentCategory?.productCount}</div>
                                        </div>
                                    
                                        <div className="detail-row">
                                            <div className="detail-label">Status</div>
                                            <div className="detail-value">Active</div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Desscription</h5>
                                        <div className="detail-row">
                                            {/* <div className="detail-label">Notes</div> */}
                                            <div className="detail-value">{currentCategory?.description}</div>
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <Link to={`/admin/update-category/${currentCategory?.id}`}>
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

export default Category;