import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, faTachometerAlt, faUsers, faBox, faShoppingCart, 
    faChartLine, faCog, faSearch, faPlus, faEllipsisH, 
    faEye, faEdit, faTrash, faChevronLeft, faChevronRight, 
    faTimes, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import '../../Index.css'; 
import './Order.css'
import { fetchDataFromApi } from '../../utils/apiCalls'; 
import { Link } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Header from "../../components/layout/Header/Header";
import {dateFormater} from "../../utils/helpers"

const Orders = () => {
    // Sample user data
    const [orders, setOrders] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [orderToDeleteId, setOrderToDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // const [orders, setOrders] = useState([
    //     {
    //         id: "ORD-1001",
    //         date: "2023-01-15T10:30:00",
    //         customer: {
    //             name: "John Doe",
    //             email: "john.doe@example.com",
    //             phone: "+1 (555) 123-4567",
    //             avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    //         },
    //         status: "processing",
    //         payment: {
    //             method: "Credit Card",
    //             status: "paid",
    //             details: "Visa ending in 4242",
    //             transaction: "ch_1Ij1Z72eZvKYlo2C0XU1xY0H"
    //         },
    //         shipping: {
    //             address: "123 Main St, Apt 4B\nNew York, NY 10001\nUnited States",
    //             method: "Standard Shipping (3-5 days)",
    //             tracking: "USPS 9405511206212345678912"
    //         },
    //         items: [
    //             {
    //                 id: "PROD-001",
    //                 name: "Wireless Headphones",
    //                 sku: "HP-001",
    //                 image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100",
    //                 price: 129.99,
    //                 quantity: 1
    //             },
    //             {
    //                 id: "PROD-005",
    //                 name: "Backpack",
    //                 sku: "BP-005",
    //                 image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100",
    //                 price: 49.99,
    //                 quantity: 1
    //             }
    //         ],
    //         subtotal: 179.98,
    //         shipping: 5.99,
    //         tax: 14.40,
    //         total: 200.37
    //     },
    //     {
    //         id: "ORD-1002",
    //         date: "2023-01-14T15:45:00",
    //         customer: {
    //             name: "Jane Smith",
    //             email: "jane.smith@example.com",
    //             phone: "+1 (555) 987-6543",
    //             avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    //         },
    //         status: "completed",
    //         payment: {
    //             method: "PayPal",
    //             status: "paid",
    //             details: "jane.smith@example.com",
    //             transaction: "5YL79347XY1234567"
    //         },
    //         shipping: {
    //             address: "456 Oak Ave\nLos Angeles, CA 90001\nUnited States",
    //             method: "Express Shipping (1-2 days)",
    //             tracking: "FedEx 123456789012"
    //         },
    //         items: [
    //             {
    //                 id: "PROD-002",
    //                 name: "Smart Watch",
    //                 sku: "SW-002",
    //                 image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100",
    //                 price: 199.99,
    //                 quantity: 1
    //             }
    //         ],
    //         subtotal: 199.99,
    //         shipping: 12.99,
    //         tax: 17.85,
    //         total: 230.83
    //     },
    //     {
    //         id: "ORD-1003",
    //         date: "2023-01-13T09:15:00",
    //         customer: {
    //             name: "Robert Johnson",
    //             email: "robert.j@example.com",
    //             phone: "+1 (555) 456-7890",
    //             avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    //         },
    //         status: "pending",
    //         payment: {
    //             method: "Credit Card",
    //             status: "unpaid",
    //             details: "Mastercard ending in 5555",
    //             transaction: ""
    //         },
    //         shipping: {
    //             address: "789 Pine Rd\nChicago, IL 60601\nUnited States",
    //             method: "Standard Shipping (3-5 days)",
    //             tracking: ""
    //         },
    //         items: [
    //             {
    //                 id: "PROD-003",
    //                 name: "Bluetooth Speaker",
    //                 sku: "BS-003",
    //                 image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100",
    //                 price: 79.99,
    //                 quantity: 2
    //             }
    //         ],
    //         subtotal: 159.98,
    //         shipping: 5.99,
    //         tax: 13.60,
    //         total: 179.57
    //     },
    //     {
    //         id: "ORD-1004",
    //         date: "2023-01-12T16:20:00",
    //         customer: {
    //             name: "Emily Wilson",
    //             email: "emily.w@example.com",
    //             phone: "+1 (555) 789-0123",
    //             avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    //         },
    //         status: "cancelled",
    //         payment: {
    //             method: "Credit Card",
    //             status: "refunded",
    //             details: "Amex ending in 1234",
    //             transaction: "ch_1Ij1a72eZvKYlo2C0XU1xY0H"
    //         },
    //         shipping: {
    //             address: "321 Elm Blvd\nHouston, TX 77001\nUnited States",
    //             method: "Standard Shipping (3-5 days)",
    //             tracking: ""
    //         },
    //         items: [
    //             {
    //                 id: "PROD-004",
    //                 name: "Running Shoes",
    //                 sku: "RS-004",
    //                 image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100",
    //                 price: 89.99,
    //                 quantity: 1
    //             },
    //             {
    //                 id: "PROD-006",
    //                 name: "Wireless Earbuds",
    //                 sku: "WE-006",
    //                 image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100",
    //                 price: 99.99,
    //                 quantity: 1
    //             }
    //         ],
    //         subtotal: 189.98,
    //         shipping: 5.99,
    //         tax: 15.70,
    //         total: 211.67
    //     }
    // ])
   
    const actionMenuRefs = useRef({});
    const sidebarRef = useRef(null);
    const deleteModalRef = useRef(null);

    useEffect(() => {
    // Fetch user data from API
        fetchDataFromApi('/api/v1/order').then((res) =>{
            console.log("orders", res)
            setOrders(res.data);
       
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
        setCurrentOrderId(id);
        setSidebarOpen(true);
        setActiveMenuId(null);
    };


    const showDeleteModal = (id) => {
        setOrderToDeleteId(id);
        setDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const hideDeleteModal = () => {
        setDeleteModalOpen(false);
        setOrderToDeleteId(null);
    };

    const confirmDelete = () => {
        if (orderToDeleteId) {
            // In a real application, you would make an API call here
            console.log(`Deleting user with ID: ${orderToDeleteId}`);
            alert(`User with ID: ${orderToDeleteId} has been deleted`);
            
            // Close modals and reset state
            hideDeleteModal();
            setSidebarOpen(false);
            setOrderToDeleteId(null);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Filter orders based on search term
    const filteredProducts = Object.entries(orders).filter(([id, user]) => {
        if (!searchTerm) return true;
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.id.toLowerCase().includes(searchTerm) ||
            user.region.toLowerCase().includes(searchTerm)
        );
    });

    const currentProduct = currentOrderId ? orders[currentOrderId] : null;
    const userToDelete = orderToDeleteId ? orders[orderToDeleteId] : null;

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="dashboard-section">

                    {/* Main Content */}
                    <div className={`${sidebarOpen ? 'sidebar-open' : ''}`}>
                        <div className="header">
                            <h1>Orders</h1>
                        </div>

                        <div className="table-container">
                            <div className="table-header">
                                <div className="table-title">Order Listing</div>
                                <div className="header-actions">
                                    <div className="search-box">
                                        <FontAwesomeIcon icon={faSearch} />
                                        <input 
                                            type="text" 
                                            placeholder="Search orders..." 
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <Link to={"/orders/create-order"}>
                                        <button className="btn btn-primary">
                                            <FontAwesomeIcon icon={faPlus} /> <span className="btn-text">Add Order</span>
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
                                            <th>Order</th>
                                            <th>Customer</th>
                                            <th>Status</th>
                                            <th>Payment</th>
                                            <th>Total</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(([id, product]) => (
                                            <tr key={id}>
                                                <td className="checkbox-cell"><input type="checkbox" /></td>
                                                <td>{product?.id}</td>
                                                <td>
                                                    <div className="user-cell">
                                                        <img src={product?.images[0]?.url} alt="product" className="user-avatar" />
                                                        <div className="user-info">
                                                            <div className="user-name">{product?.name}</div>
                                                            {/* <div className="user-email">{product?.slug}</div> */}

                                                        </div>
                                                    </div>
                                                </td>
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
                                    <h3>Order Details</h3>
                                    <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                 <div className="order-detail">
                                    <div className="order-header">
                                        <div className="order-info-header">
                                            <h4 id="orderId">Order #ORD-1001</h4>
                                            <p id="orderDate">Placed on Jan 15, 2023 at 10:30 AM</p>
                                            <span className="order-status status-processing" id="orderStatus">Processing</span>
                                        </div>
                                    </div>

                                    <div className="customer-details">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Customer" className="customer-avatar-lg" id="customerAvatar"/>
                                        <div className="customer-info-lg">
                                            <div className="customer-name-lg" id="customerName">John Doe</div>
                                            <div className="customer-meta" id="customerEmail">john.doe@example.com</div>
                                            <div className="customer-meta" id="customerPhone">+1 (555) 123-4567</div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Shipping Information</h5>
                                        <div className="detail-row">
                                            <div className="detail-label">Address</div>
                                            <div className="detail-value" id="shippingAddress">
                                                123 Main St, Apt 4B<br/>
                                                New York, NY 10001<br/>
                                                United States
                                            </div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Method</div>
                                            <div className="detail-value" id="shippingMethod">Standard Shipping (3-5 days)</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Tracking</div>
                                            <div className="detail-value" id="trackingNumber">USPS 9405511206212345678912</div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Payment Information</h5>
                                        <div className="detail-row">
                                            <div className="detail-label">Method</div>
                                            <div className="detail-value" id="paymentMethod">Credit Card (Visa ending in 4242)</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Status</div>
                                            <div className="detail-value" id="paymentStatus">Paid</div>
                                        </div>
                                        <div className="detail-row">
                                            <div className="detail-label">Transaction</div>
                                            <div className="detail-value" id="transactionId">ch_1Ij1Z72eZvKYlo2C0XU1xY0H</div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h5>Order Items</h5>
                                        <div className="products-list" id="orderItems">
                                            {/* {
                                                orders.length > 0 && orders.map((item) => (
                                                    <div className='product-item'>
                                                        <img src={item.image} alt={item.name} class="product-image-sm"/>
                                                        <div class="product-info-sm">
                                                            <div class="product-name-sm">{item.name}</div>
                                                            <div class="product-sku-sm">SKU: {item.sku}</div>
                                                            <div>Qty: ${item.quantity}</div>
                                                        </div>
                                                        <div class="product-price">${(item.price * item.quantity).toFixed(2)}</div>
                                                    </div>
                                                ))
                                            } */}
                            
                                        </div>
                                    </div>

                                    <div className="order-summary">
                                        <div className="summary-row">
                                            <div>Subtotal</div>
                                            <div>$129.99</div>
                                        </div>
                                        <div className="summary-row">
                                            <div>Shipping</div>
                                            <div>$5.99</div>
                                        </div>
                                        <div className="summary-row">
                                            <div>Tax</div>
                                            <div>$10.80</div>
                                        </div>
                                        <div className="summary-row summary-total">
                                            <div>Total</div>
                                            <div>$146.78</div>
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <button className="btn btn-success" onclick="updateOrderStatus()">
                                            <i className="fas fa-check"></i> Complete Order
                                        </button>
                                        <button className="btn btn-warning" onclick="updateOrderStatus()">
                                            <i className="fas fa-sync-alt"></i> Process Order
                                        </button>
                                        <button className="btn btn-danger" onclick="updateOrderStatus()">
                                            <i className="fas fa-times"></i> Cancel Order
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
                                <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Delete user</h3>
                                <button className="close-sidebar" onClick={hideDeleteModal}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <p className="modal-message">
                                    {userToDelete ? 
                                        `Are you sure you want to delete ORDER ${orderToDelete?.name} (${orderToDelete?.id})? This action cannot be undone.` : 
                                        'Are you sure you want to delete this ORDER? This action cannot be undone.'}
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

export default Orders;