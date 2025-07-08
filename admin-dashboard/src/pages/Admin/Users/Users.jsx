import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, faTachometerAlt, faUsers, faBox, faShoppingCart, 
    faChartLine, faCog, faSearch, faPlus, faEllipsisH, 
    faEye, faEdit, faTrash, faChevronLeft, faChevronRight, 
    faTimes, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import '../../Index.css'; 
import './User.css'
import { fetchDataFromApi } from '../../../utils/apiCalls'; 
import { Link } from 'react-router-dom';
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import Header from "../../../components/layout/Header/Header";
import {dateFormater} from "../../../utils/helpers"

const Users = () => {
    // Sample user data
    const [users, setUsers] = useState([]);

    const [currentUserId, setCurrentUserId] = useState(null);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    
    const actionMenuRefs = useRef({});
    const sidebarRef = useRef(null);
    const deleteModalRef = useRef(null);

    useEffect(() => {
    // Fetch user data from API
        fetchDataFromApi('/api/v1/user').then((res) =>{
            console.log('User data:', res);
            setUsers(res?.data);
       
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
        setCurrentUserId(id);
        setSidebarOpen(true);
        setActiveMenuId(null);
    };


    const showDeleteModal = (id) => {
        setUserToDeleteId(id);
        setDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const hideDeleteModal = () => {
        setDeleteModalOpen(false);
        setUserToDeleteId(null);
    };

    const confirmDelete = () => {
        if (userToDeleteId) {
            // In a real application, you would make an API call here
            console.log(`Deleting user with ID: ${userToDeleteId}`);
            alert(`User with ID: ${userToDeleteId} has been deleted`);
            
            // Close modals and reset state
            hideDeleteModal();
            setSidebarOpen(false);
            setUserToDeleteId(null);
        }
    };

    const editCurrentUser = () => {
        if (currentUserId) {
            editUser(currentUserId);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Filter Users based on search term
    const filteredUsers = Object.entries(users).filter(([id, user]) => {
        if (!searchTerm) return true;
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.id.toLowerCase().includes(searchTerm) ||
            user.region.toLowerCase().includes(searchTerm)
        );
    });

    const currentUser = currentUserId ? users[currentUserId] : null;
    const userToDelete = userToDeleteId ? users[userToDeleteId] : null;

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="dashboard-section">

                    {/* Main Content */}
                    <div className={`${sidebarOpen ? 'sidebar-open' : ''}`}>
                        <div className="header">
                            <h1>Users</h1>
                        </div>

                        <div className="table-container">
                            <div className="table-header">
                                <div className="table-title">User List</div>
                                <div className="header-actions">
                                    <div className="search-box">
                                        <FontAwesomeIcon icon={faSearch} />
                                        <input 
                                            type="text" 
                                            placeholder="Search Users..." 
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <button className="btn btn-primary">
                                        <FontAwesomeIcon icon={faPlus} /> <span className="btn-text">Add User</span>
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="desktop-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="checkbox-cell"><input type="checkbox" /></th>
                                            <th>Name</th>
                                            <th>ID</th>
                                            <th>Account Type</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(([id, user]) => (
                                            <tr key={id}>
                                                <td className="checkbox-cell"><input type="checkbox" /></td>
                                                <td>
                                                    <div className="user-cell">
                                                        <img src={user.avatar} alt="User" className="user-avatar" />
                                                        <div className="user-info">
                                                            <div className="user-name">{user.name}</div>
                                                            <div className="user-email">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.id}</td>
                                                <td>{user.role}</td>
                                                <td>{user.status}</td>
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
                                                        <Link to={`/admin/user/profile-update/${user?.id}`}>
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
                                {filteredUsers.map(([id, user]) => (
                                    <div className="user-card" key={`mobile-${id}`}>
                                        <div className="card-header">
                                            <div className="checkbox-cell"><input type="checkbox" /></div>
                                            <div className="user-info">
                                                <img src={user.avatar} alt="User" className="user-avatar" />
                                                <div>
                                                    <div className="user-name">{user.name}</div>
                                                    <div className="user-email">{user.email}</div>
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

                                                <Link to={`/admin/user/profile-update/${user?.id}`}>
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
                                                <span className="detail-value">{user.id}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Role:</span>
                                                <span className="detail-value">{user.role}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Status:</span>
                                                <span className="detail-value">{user.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="table-footer">
                                <div>Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries</div>
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

                    {/* User Detail Sidebar */}
                    <div className={`detail-sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                        {currentUser && (
                            <>
                                <div className="sidebar-header">
                                    <h3>User Details</h3>
                                    <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className="user-detail">
                                    <div className="user-header">
                                        <img src={currentUser.avatar} alt="User" className="user-avatar" />
                                        <div className="user-info">
                                            <h4>{currentUser.firstName && currentUser.lasnName ? `${currentUser.firstName} ${currentUser.firstName}` : currentUser.name}</h4>
                                            <p>{currentUser.contact }</p>
                                            <span className={`user-status status-${currentUser.status.toLowerCase()}`}>
                                                {currentUser.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Personal Information</h5>
                                        <div className="detail-row">
                                            <div className="detail-label">User ID</div>
                                            <div className="detail-value">{currentUser.id}</div>
                                        </div>
                                        {
                                            currentUser?.phone && 
                                            <div className="detail-row">
                                                <div className="detail-label">Phone</div>
                                                <div className="detail-value">{currentUser.phone}</div>
                                            </div>
                                        }

                                        {
                                            currentUser?.Email && 
                                            <div className="detail-row">
                                                <div className="detail-label">Phone</div>
                                                <div className="detail-value">{currentUser.email}</div>
                                            </div>
                                        }

                                        {
                                            currentUser.address &&
                                            <div className="detail-row">
                                                <div className="detail-label">Location</div>
                                                <div className="detail-value">{currentUser.address}</div>
                                            </div>
                                        }

                                        <div className="detail-row">
                                            <div className="detail-label">Member Since</div>
                                            <div className="detail-value">{dateFormater(currentUser.createdAt)}</div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Account Information</h5>
                                        <div className="detail-row">
                                            <div className="detail-label">Status</div>
                                            <div className="detail-value">{currentUser.status}</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Last Update</div>
                                            <div className="detail-value">{dateFormater(currentUser.updatedAt)}</div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Additional Information</h5>
                                        <div className="detail-row">
                                            <div className="detail-label">Notes</div>
                                            <div className="detail-value">{currentUser.notes}</div>
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <Link to={`/admin/user/profile-update/${currentUser?.id}`}>
                                            <button className="btn btn-primary" onClick={editCurrentUser}>
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
                                        `Are you sure you want to delete user ${userToDelete.name} (${userToDelete.id})? This action cannot be undone.` : 
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

export default Users;