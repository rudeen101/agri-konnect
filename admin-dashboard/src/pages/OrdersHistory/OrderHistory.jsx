import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, faTachometerAlt, faUsers, faBox, faShoppingCart, 
    faChartLine, faCog, faSearch, faPlus, faEllipsisH, 
    faEye, faEdit, faTrash, faChevronLeft, faChevronRight, 
    faTimes, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
// import './Customer.css'; // We'll create this CSS file next

const Customers = () => {
    // Sample customer data
    const [customers, setCustomers] = useState({
        1: {
            name: "Sarah Johnson",
            email: "sarah@example.com",
            id: "#CUS-001",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            phone: "+1 (555) 123-4567",
            location: "New York, USA",
            region: "North America",
            memberSince: "Jan 12, 2022",
            status: "Active",
            lastLogin: "2 hours ago",
            ip: "192.168.1.1",
            notes: "Preferred contact method is email. VIP customer."
        },
        2: {
            name: "Michael Chen",
            email: "michael@example.com",
            id: "#CUS-002",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            phone: "+86 138 1234 5678",
            location: "Shanghai, China",
            region: "Asia",
            memberSince: "Mar 5, 2021",
            status: "Active",
            lastLogin: "1 day ago",
            ip: "203.156.34.12",
            notes: "Enterprise customer. Contact through WeChat."
        },
        3: {
            name: "Emma Wilson",
            email: "emma@example.com",
            id: "#CUS-003",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            phone: "+44 7700 900123",
            location: "London, UK",
            region: "Europe",
            memberSince: "Nov 20, 2020",
            status: "Inactive",
            lastLogin: "3 days ago",
            ip: "81.134.56.78",
            notes: "Occasional buyer. Prefers phone calls in the evening."
        },
        4: {
            name: "David Rodriguez",
            email: "david@example.com",
            id: "#CUS-004",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
            phone: "+55 11 98765 4321",
            location: "São Paulo, Brazil",
            region: "South America",
            memberSince: "Aug 15, 2021",
            status: "Active",
            lastLogin: "1 week ago",
            ip: "177.34.210.56",
            notes: "Bulk orders. Contact through WhatsApp."
        },
        5: {
            name: "Sophia Kim",
            email: "sophia@example.com",
            id: "#CUS-005",
            avatar: "https://randomuser.me/api/portraits/women/90.jpg",
            phone: "+82 10 1234 5678",
            location: "Seoul, South Korea",
            region: "Asia",
            memberSince: "Feb 28, 2022",
            status: "Active",
            lastLogin: "2 weeks ago",
            ip: "211.234.78.90",
            notes: "New customer. Interested in premium products."
        }
    });

    const [currentCustomerId, setCurrentCustomerId] = useState(null);
    const [customerToDeleteId, setCustomerToDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    
    const actionMenuRefs = useRef({});
    const sidebarRef = useRef(null);
    const deleteModalRef = useRef(null);

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

    const viewCustomer = (id) => {
        setCurrentCustomerId(id);
        setSidebarOpen(true);
        setActiveMenuId(null);
    };

    const editCustomer = (id) => {
        alert(`Edit customer with ID: ${id}`);
        setActiveMenuId(null);
        setSidebarOpen(false);
    };

    const showDeleteModal = (id) => {
        setCustomerToDeleteId(id);
        setDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const hideDeleteModal = () => {
        setDeleteModalOpen(false);
        setCustomerToDeleteId(null);
    };

    const confirmDelete = () => {
        if (customerToDeleteId) {
            // In a real application, you would make an API call here
            console.log(`Deleting customer with ID: ${customerToDeleteId}`);
            alert(`Customer with ID: ${customerToDeleteId} has been deleted`);
            
            // Close modals and reset state
            hideDeleteModal();
            setSidebarOpen(false);
            setCustomerToDeleteId(null);
        }
    };

    const editCurrentCustomer = () => {
        if (currentCustomerId) {
            editCustomer(currentCustomerId);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Filter customers based on search term
    const filteredCustomers = Object.entries(customers).filter(([id, customer]) => {
        if (!searchTerm) return true;
        return (
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.id.toLowerCase().includes(searchTerm) ||
            customer.region.toLowerCase().includes(searchTerm)
        );
    });

    const currentCustomer = currentCustomerId ? customers[currentCustomerId] : null;
    const customerToDelete = customerToDeleteId ? customers[customerToDeleteId] : null;

    return (
        <div className="dashboard-section">

            {/* Main Content */}
            <div className={`${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="header">
                    <h1>Customers</h1>
                </div>

                <div className="table-container">
                    <div className="table-header">
                        <div className="table-title">Customer List</div>
                        <div className="header-actions">
                            <div className="search-box">
                                <FontAwesomeIcon icon={faSearch} />
                                <input 
                                    type="text" 
                                    placeholder="Search customers..." 
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                            <button className="btn btn-primary">
                                <FontAwesomeIcon icon={faPlus} /> <span className="btn-text">Add Customer</span>
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
                                    <th>Region</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map(([id, customer]) => (
                                    <tr key={id}>
                                        <td className="checkbox-cell"><input type="checkbox" /></td>
                                        <td>
                                            <div className="user-cell">
                                                <img src={customer.avatar} alt="User" className="user-avatar" />
                                                <div className="user-info">
                                                    <div className="user-name">{customer.name}</div>
                                                    <div className="user-email">{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{customer.id}</td>
                                        <td>{customer.region}</td>
                                        <td>{customer.lastLogin}</td>
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
                                                <button className="view" onClick={() => viewCustomer(id)}>
                                                    <FontAwesomeIcon icon={faEye} /> View
                                                </button>
                                                <button className="edit" onClick={() => editCustomer(id)}>
                                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                                </button>
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
                        {filteredCustomers.map(([id, customer]) => (
                            <div className="customer-card" key={`mobile-${id}`}>
                                <div className="card-header">
                                    <div className="checkbox-cell"><input type="checkbox" /></div>
                                    <div className="user-info">
                                        <img src={customer.avatar} alt="User" className="user-avatar" />
                                        <div>
                                            <div className="user-name">{customer.name}</div>
                                            <div className="user-email">{customer.email}</div>
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
                                        <button className="view" onClick={() => viewCustomer(id)}>
                                            <FontAwesomeIcon icon={faEye} /> View
                                        </button>
                                        <button className="edit" onClick={() => editCustomer(id)}>
                                            <FontAwesomeIcon icon={faEdit} /> Edit
                                        </button>
                                        <button className="delete" onClick={() => showDeleteModal(id)}>
                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="card-details">
                                    <div className="detail-row">
                                        <span className="detail-label">ID:</span>
                                        <span className="detail-value">{customer.id}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Region:</span>
                                        <span className="detail-value">{customer.region}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Updated:</span>
                                        <span className="detail-value">{customer.lastLogin}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="table-footer">
                        <div>Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} entries</div>
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

            {/* Customer Detail Sidebar */}
            <div className={`detail-sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                {currentCustomer && (
                    <>
                        <div className="sidebar-header">
                            <h3>Customer Details</h3>
                            <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="customer-detail">
                            <div className="customer-header">
                                <img src={currentCustomer.avatar} alt="Customer" className="customer-avatar" />
                                <div className="customer-info">
                                    <h4>{currentCustomer.name}</h4>
                                    <p>{currentCustomer.email}</p>
                                    <span className={`customer-status status-${currentCustomer.status.toLowerCase()}`}>
                                        {currentCustomer.status}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h5>Personal Information</h5>
                                <div className="detail-row">
                                    <div className="detail-label">Customer ID</div>
                                    <div className="detail-value">{currentCustomer.id}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Phone</div>
                                    <div className="detail-value">{currentCustomer.phone}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Location</div>
                                    <div className="detail-value">{currentCustomer.location}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Region</div>
                                    <div className="detail-value">{currentCustomer.region}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Member Since</div>
                                    <div className="detail-value">{currentCustomer.memberSince}</div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h5>Account Information</h5>
                                <div className="detail-row">
                                    <div className="detail-label">Status</div>
                                    <div className="detail-value">{currentCustomer.status}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Last Login</div>
                                    <div className="detail-value">{currentCustomer.lastLogin}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">IP Address</div>
                                    <div className="detail-value">{currentCustomer.ip}</div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h5>Additional Information</h5>
                                <div className="detail-row">
                                    <div className="detail-label">Notes</div>
                                    <div className="detail-value">{currentCustomer.notes}</div>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={editCurrentCustomer}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                                <button className="btn btn-outline" onClick={() => setSidebarOpen(false)}>
                                    <FontAwesomeIcon icon={faTimes} /> Close
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`modal-overlay ${deleteModalOpen ? 'active' : ''}`}>
                <div className="modal" ref={deleteModalRef}>
                    <div className="modal-header">
                        <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Delete Customer</h3>
                        <button className="close-sidebar" onClick={hideDeleteModal}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="modal-message">
                            {customerToDelete ? 
                                `Are you sure you want to delete customer ${customerToDelete.name} (${customerToDelete.id})? This action cannot be undone.` : 
                                'Are you sure you want to delete this customer? This action cannot be undone.'}
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
    );
};

export default Customers;