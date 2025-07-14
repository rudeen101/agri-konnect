import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, faTachometerAlt, faUsers, faBox, faTags, 
  faShoppingCart, faChartLine, faCog, faSearch, 
  faPlus, faEllipsisH, faEye, faSyncAlt, faCheck, 
  faTimes, faChevronLeft, faChevronRight, faFilter 
} from '@fortawesome/free-solid-svg-icons';
import { fetchDataFromApi, updateDataToApi } from '../../utils/apiCalls'; 
import { Link } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Header from "../../components/layout/Header/Header";
import {dateFormater} from "../../utils/helpers"

const Order = () => {
    // Sample order data
    // const initialOrders = [
    //     {
    //     id: "ORD-1001",
    //     date: "2023-01-15T10:30:00",
    //     customer: {
    //         name: "John Doe",
    //         email: "john.doe@example.com",
    //         phone: "+1 (555) 123-4567",
    //         avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    //     },
    //     status: "processing",
    //     payment: {
    //         method: "Credit Card",
    //         status: "paid",
    //         details: "Visa ending in 4242",
    //         transaction: "ch_1Ij1Z72eZvKYlo2C0XU1xY0H"
    //     },
    //     shipping: {
    //         address: "123 Main St, Apt 4B\nNew York, NY 10001\nUnited States",
    //         method: "Standard Shipping (3-5 days)",
    //         tracking: "USPS 9405511206212345678912"
    //     },
    //     items: [
    //         {
    //         id: "PROD-001",
    //         name: "Wireless Headphones",
    //         sku: "HP-001",
    //         image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100",
    //         price: 129.99,
    //         quantity: 1
    //         },
    //         {
    //         id: "PROD-005",
    //         name: "Backpack",
    //         sku: "BP-005",
    //         image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100",
    //         price: 49.99,
    //         quantity: 1
    //         }
    //     ],
    //     subtotal: 179.98,
    //     shippingCost: 5.99,
    //     tax: 14.40,
    //     total: 200.37
    //     },
    //     // ... (other orders data remains the same)
    // ];

    // State management
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [orderStats, setOrderStats] = useState([]);

    // Fetch order data from API
    useEffect(() => {
        fetchDataFromApi('/api/v1/order').then((res) =>{
            console.log("orders--", res.data)
            setOrders(res.data);
        
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    // Get order statistics 
    useEffect(() => {
        fetchDataFromApi('/api/v1/order/stats').then((res) =>{
            console.log("orders stats", res)
            setOrderStats(res.data);
        
        }).catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    // Check for mobile view on resize and initial load
    useEffect(() => {
        const checkIfMobile = () => {
        setIsMobileView(window.innerWidth < 768);
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
        window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Filter and search orders
    useEffect(() => {
        let result = [...orders];
        
        if (statusFilter) {
        result = result.filter(order => order.status === statusFilter);
        }
        
        if (paymentFilter) {
        result = result.filter(order => order.payment.status === paymentFilter);
        }
        
        if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(order => 
            order.id.toLowerCase().includes(term) ||
            order.customer.name.toLowerCase().includes(term) ||
            order.customer.email.toLowerCase().includes(term) ||
            order.customer.phone.toLowerCase().includes(term)
        );
        }
        
        setFilteredOrders(result);
    }, [orders, statusFilter, paymentFilter, searchTerm]);

    // Helper functions
    const getStatusClass = (status) => {
        switch(status) {
        case 'pending': return 'status-pending';
        case 'processing': return 'status-processing';
        case 'completed': return 'status-completed';
        case 'cancelled': return 'status-cancelled';
        default: return '';
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Order actions
    const viewOrder = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        setCurrentOrder(order);
        setSidebarOpen(true);
    };

    const closeDetailSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleActionMenu = (orderId) => {
        setActiveMenu(activeMenu === orderId ? null : orderId);
    };

    const showStatusModal = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        setCurrentOrder(order);
        setSelectedStatus(order.status);
        setStatusModalOpen(true);
    };

    const hideStatusModal = () => {
        setStatusModalOpen(false);
    };

    const showNotification = (message) => {
        setNotificationMessage(message);
        setNotificationModalOpen(true);
    };

    const hideNotification = () => {
        setNotificationModalOpen(false);
    };

    const confirmStatusUpdate = async () => {
        if (currentOrder) {
            const updatedOrders = orders.map(order => 
                order.id === currentOrder.id ? { ...order, status: selectedStatus } : order
            );
            
            setOrders(updatedOrders);
            setCurrentOrder({ ...currentOrder, status: selectedStatus });
            hideStatusModal();

            const response = await updateDataToApi(`/api/v1/order/${currentOrder.id}/status`, {status: selectedStatus})
        
            if (response.success) {
                // Show success message
                showNotification(`Order #${currentOrder.id} status updated to ${selectedStatus}`);
            } else {
                showNotification(`Could not update Order #${currentOrder.id} status to ${selectedStatus}`);
                throw new Error(response.message || 'Operation failed');
            }
        }
    };

    const completeOrder = (orderId) => {
        if (window.confirm(`Mark order #${orderId} as completed?`)) {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status: 'completed' } : order
        );
        
        setOrders(updatedOrders);
        if (sidebarOpen && currentOrder && currentOrder.id === orderId) {
            setCurrentOrder({ ...currentOrder, status: 'completed' });
        }
        showNotification(`Order #${orderId} marked as completed`);
        }
    };

    const cancelOrder = (orderId) => {
        if (window.confirm(`Cancel order #${orderId}? This cannot be undone.`)) {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status: 'cancelled' } : order
        );
        
        setOrders(updatedOrders);
        if (sidebarOpen && currentOrder && currentOrder.id === orderId) {
            setCurrentOrder({ ...currentOrder, status: 'cancelled' });
        }
        showNotification(`Order #${orderId} has been cancelled`);
        }
    };

    const updateOrderStatus = () => {
        if (currentOrder) {
        showStatusModal(currentOrder.id);
        }
    };

    // Mobile table row click handler
    const handleMobileRowClick = (orderId) => {
        if (isMobileView) {
        viewOrder(orderId);
        }
    };

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

                    {/* Order Stats */}
                    <div className="stats-cards">
                        <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>{orderStats?.totalOrders}</p>
                        </div>
                        <div className="stat-card">
                        <h3>Pending</h3>
                        <p>{orderStats?.pendingOrders}</p>
                        </div>
                        <div className="stat-card">
                        <h3>Processing</h3>
                        <p>{orderStats?.processingOrders}</p>
                        </div>
                        <div className="stat-card">
                        <h3>Revenue</h3>
                        <p>${orderStats?.totalRevenue}</p>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    {/* <div className="filter-bar">
                        <div className="filter-group">
                        <select 
                            className="filter-select" 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select 
                            className="filter-select" 
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                        >
                            <option value="">All Payments</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                        </div>
                        <div className="date-range">
                        <input type="date" className="date-input" />
                        <span>to</span>
                        <input type="date" className="date-input" />
                        <button className="btn btn-outline">
                            <FontAwesomeIcon icon={faFilter} /> Filter
                        </button>
                        </div>
                    </div> */}

                    {/* Orders Table */}
                    <div className="table-container">
                        <div className="table-header">
                        <div className="table-title">Recent Orders</div>
                        <div className="header-actions">
                            <div className="search-box">
                            <FontAwesomeIcon icon={faSearch} />
                            <input 
                                type="text" 
                                placeholder="Search orders..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            </div>
                            <button className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} /> Create Order
                            </button>
                        </div>
                        </div>

                        {isMobileView ? (
                        // Mobile-friendly orders list
                        <div className="mobile-orders-list">
                            {filteredOrders?.map(order => {
                            const statusClass = getStatusClass(order.status);
                            const paymentClass = order.status === 'paid' ? 'text-success' : 'text-danger';
                            
                            return (
                                <div 
                                key={order.id} 
                                className="mobile-order-card"
                                onClick={() => handleMobileRowClick(order.id)}
                                >
                                <div className="mobile-order-header">
                                    <div className="mobile-order-id">#{order.id}</div>
                                    <div className="mobile-order-date">{formatDate(order.date)}</div>
                                </div>
                                <div className="mobile-order-customer">
                                    {/* <img src={order.customer.avatar} alt={order.user.name} className="mobile-customer-avatar" /> */}
                                    <div className="mobile-customer-info">
                                    <div className="mobile-customer-name">{order.user.name}</div>
                                    <div className="mobile-customer-email">{order.user.contact}</div>
                                    </div>
                                </div>
                                <div className="mobile-order-details">
                                    <div className="mobile-order-status">
                                    <span className={`status-badge ${statusClass}`}>
                                        {capitalizeFirstLetter(order.status)}
                                    </span>
                                    </div>
                                    <div className={`mobile-order-payment ${paymentClass}`}>
                                    {capitalizeFirstLetter(order.status)}
                                    </div>
                                    <div className="mobile-order-total">${order.totalPrice.toFixed(2)}</div>
                                </div>
                                <div className="mobile-order-actions">
                                    <button 
                                    className="btn btn-outline btn-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showStatusModal(order.id);
                                    }}
                                    >
                                    <FontAwesomeIcon icon={faSyncAlt} />
                                    </button>
                                    <button 
                                    className="btn btn-outline btn-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        viewOrder(order.id);
                                    }}
                                    >
                                    <FontAwesomeIcon icon={faEye} />
                                    </button>
                                </div>
                                </div>
                            );
                            })}
                        </div>
                        ) : (
                        // Desktop table view
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
                            {filteredOrders.map(order => {
                                const statusClass = getStatusClass(order.status);
                                const paymentClass = order?.status === 'paid' ? 'text-success' : 'text-danger';
                                
                                return (
                                <tr key={order.id}>
                                    <td className="checkbox-cell"><input type="checkbox" /></td>
                                    <td>
                                    <div className="order-cell">
                                        <div className="order-id">#{order.id}</div>
                                        <div className="order-date">{formatDate(order.createdAt)}</div>
                                    </div>
                                    </td>
                                    <td>
                                    <div className="customer-cell">
                                        {/* <img src={order.customer.avatar} alt={order.user.name} className="customer-avatar" /> */}
                                        <div className="customer-info">
                                        <div className="customer-name">{order.user.name}</div>
                                        <div className="customer-email">{order.user.contact}</div>
                                        </div>
                                    </div>
                                    </td>
                                    <td><span className={`status-badge ${statusClass}`}>{capitalizeFirstLetter(order.status)}</span></td>
                                    <td className={paymentClass}>{capitalizeFirstLetter(order.status)}</td>
                                    <td className="price-cell">${order.totalPrice.toFixed(2)}</td>
                                    <td className="action-cell">
                                    <button 
                                        className="action-btn" 
                                        onClick={() => toggleActionMenu(order.id)}
                                    >
                                        <FontAwesomeIcon icon={faEllipsisH} />
                                    </button>
                                    <div className={`action-menu ${activeMenu === order.id ? 'active' : ''}`}>
                                        <button className="view" onClick={() => viewOrder(order.id)}>
                                        <FontAwesomeIcon icon={faEye} /> View
                                        </button>
                                        <button className="process" onClick={() => showStatusModal(order.id)}>
                                        <FontAwesomeIcon icon={faSyncAlt} /> Process
                                        </button>
                                        {/* <button className="complete" onClick={() => completeOrder(order.id)}>
                                        <FontAwesomeIcon icon={faCheck} /> Complete
                                        </button>
                                        <button className="cancel" onClick={() => cancelOrder(order.id)}>
                                        <FontAwesomeIcon icon={faTimes} /> Cancel
                                        </button> */}
                                    </div>
                                    </td>
                                </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        )}

                        <div className="table-footer">
                        <div>Showing 1 to {filteredOrders.length} of {orders.length} entries</div>
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

                    {/* Order Detail Sidebar */}
                    <div className={`detail-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    {currentOrder && (
                        <>
                        <div className="sidebar-header">
                            <h3>Order Details</h3>
                            <button className="close-sidebar" onClick={closeDetailSidebar}>
                            <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="order-detail">
                            <div className="order-header">
                            <div className="order-info-header">
                                <h4>Order #{currentOrder.id}</h4>
                                <p>Placed on {formatDate(currentOrder.createdAt)}</p>
                                <span className={`order-status ${getStatusClass(currentOrder.status)}`}>
                                {capitalizeFirstLetter(currentOrder.status)}
                                </span>
                            </div>
                            </div>

                            <div className="customer-details">
                            {/* <img src={currentOrder.customer.avatar} alt={currentOrder.customer.name} className="customer-avatar-lg" /> */}
                            <div className="customer-info-lg">
                                <div className="customer-name-lg">{currentOrder.user.name}</div>
                                {currentOrder.user.email && <div className="customer-meta">{currentOrder.user.email}</div> }
                                {currentOrder.user.phone && <div className="customer-meta">{currentOrder.user.phoneNumber}</div> }
                            </div>
                            </div>

                            <div className="detail-section">
                            <h5>Shipping Information</h5>
                            <div className="detail-row">
                                <div className="detail-label">Address</div>
                                <div className="detail-value">
                                {`${currentOrder?.shippingAddress.address}, ${currentOrder.shippingAddress.city}, ${currentOrder.shippingAddress.county}`}
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Method</div>
                                <div className="detail-value">{currentOrder.paymentMethod}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Tracking</div>
                                <div className="detail-value">
                                {currentOrder.shippingAddress.tracking || 'Not available'}
                                </div>
                            </div>
                            </div>

                            <div className="detail-section">
                            <h5>Payment Information</h5>
                            <div className="detail-row">
                                <div className="detail-label">Method</div>
                                <div className="detail-value">
                                {currentOrder.paymentMethod} 
                                {/* ({currentOrder.payment.details}) */}
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Status</div>
                                <div className="detail-value">
                                {capitalizeFirstLetter(currentOrder.status)}
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Transaction</div>
                                <div className="detail-value">
                                {currentOrder?.transaction || 'Not available'}
                                </div>
                            </div>
                            </div>

                            <div className="detail-section">
                            <h5>Order Items</h5>
                            <div className="products-list">
                                {currentOrder.orderItems.map(item => (
                                <div className="product-item" key={item?.product}>
                                    <img src={item?.images[0]} alt={item?.name} className="product-image-sm" />
                                    <div className="product-info-sm">
                                    <div className="product-name-sm">{item?.name}</div>
                                    {/* <div className="product-sku-sm">SKU: {item.sku}</div> */}
                                    <div>Qty: {item?.quantity}</div>
                                    </div>
                                    <div className="product-price">
                                    ${(item?.price * item?.quantity).toFixed(2)}
                                    </div>
                                </div>
                                ))}
                            </div>
                            </div>

                            <div className="order-summary">
                            <div className="summary-row">
                                <div>Subtotal</div>
                                <div>${currentOrder?.totalPrice?.toFixed(2)}</div>
                            </div>
                            <div className="summary-row">
                                <div>Shipping</div>
                                <div>${currentOrder.shippingPrice.toFixed(2)}</div>
                            </div>
                            {/* <div className="summary-row">
                                <div>Tax</div>
                                <div>${currentOrder.tax.toFixed(2)}</div>
                            </div> */}
                            <div className="summary-row summary-total">
                                <div>Total</div>
                                <div>${currentOrder.totalPrice.toFixed(2)}</div>
                            </div>
                            </div>

                            <div className="action-buttons">
                            <button className="btn btn-success" onClick={updateOrderStatus}>
                                <FontAwesomeIcon icon={faCheck} /> Complete Order
                            </button>
                            <button className="btn btn-warning" onClick={updateOrderStatus}>
                                <FontAwesomeIcon icon={faSyncAlt} /> Process Order
                            </button>
                            <button className="btn btn-danger" onClick={updateOrderStatus}>
                                <FontAwesomeIcon icon={faTimes} /> Cancel Order
                            </button>
                            </div>
                        </div>
                        </>
                    )}
                    </div>

                    {/* Status Update Modal */}
                    <div className={`modal-overlay ${statusModalOpen ? 'active' : ''}`}>
                    <div className="modal">
                        <div className="modal-header">
                        <h3>Update Order Status</h3>
                        <button className="close-sidebar" onClick={hideStatusModal}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        </div>
                        <div className="modal-body">
                        <p className="modal-message">
                            Select the new status for order <strong>#{currentOrder?.id}</strong>
                        </p>
                        <div className="status-options">
                            <label className="status-option">
                            <input 
                                type="radio" 
                                name="orderStatus" 
                                value="pending" 
                                checked={selectedStatus === 'pending'}
                                onChange={() => setSelectedStatus('pending')}
                            />
                            Pending
                            <span className="status-badge status-pending">Pending</span>
                            </label>
                            <label className="status-option">
                            <input 
                                type="radio" 
                                name="orderStatus" 
                                value="processing" 
                                checked={selectedStatus === 'processing'}
                                onChange={() => setSelectedStatus('processing')}
                            />
                            Processing
                            <span className="status-badge status-processing">Processing</span>
                            </label>
                            <label className="status-option">
                            <input 
                                type="radio" 
                                name="orderStatus" 
                                value="completed" 
                                checked={selectedStatus === 'completed'}
                                onChange={() => setSelectedStatus('completed')}
                            />
                            Completed
                            <span className="status-badge status-completed">Completed</span>
                            </label>
                            <label className="status-option">
                            <input 
                                type="radio" 
                                name="orderStatus" 
                                value="cancelled" 
                                checked={selectedStatus === 'cancelled'}
                                onChange={() => setSelectedStatus('cancelled')}
                            />
                            Cancelled
                            <span className="status-badge status-cancelled">Cancelled</span>
                            </label>
                        </div>
                        </div>
                        <div className="modal-footer">
                        <button className="btn btn-outline" onClick={hideStatusModal}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={confirmStatusUpdate}>
                            Update Status
                        </button>
                        </div>
                    </div>
                    </div>

                    {/* Notification Modal */}
                    <div className={`modal-overlay ${notificationModalOpen ? 'active' : ''}`}>
                    <div className="modal">
                        <div className="modal-header">
                        <h3>Notification</h3>
                        <button className="close-sidebar" onClick={hideNotification}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        </div>
                        <div className="modal-body">
                        <p className="modal-message">{notificationMessage}</p>
                        </div>
                        <div className="modal-footer">
                        <button className="btn btn-primary" onClick={hideNotification}>
                            OK
                        </button>
                        </div>
                    </div>
                    </div>

                </div>
            </div>


            {/* CSS Styles */}
            <style jsx global>{`
            // :root {
            //     --primary: #3a86ff;
            //     --primary-dark: #2667cc;
            //     --secondary: #8338ec;
            //     --success: #06d6a0;
            //     --warning: #ffbe0b;
            //     --danger: #ef476f;
            //     --light: #f8f9fa;
            //     --dark: #212529;
            //     --gray: #6c757d;
            //     --gray-light: #e9ecef;
            //     --border: #dee2e6;
            //     --text-success: #28a745;
            //     --text-danger: #dc3545;
            // }

      

 





  


            .btn-success {
                background-color: var(--success);
                color: white;
            }

            .btn-success:hover {
                background-color: #05b388;
            }

            .btn-warning {
                background-color: var(--warning);
                color: var(--dark);
            }

            .btn-warning:hover {
                background-color: #e6ac00;
            }

            .btn-sm {
                padding: 5px 10px;
                font-size: 0.8rem;
            }

            .user-menu {
                display: flex;
                align-items: center;
            }

            .user-menu img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
            }

            .user-menu span {
                font-weight: 500;
            }

            /* Filter Bar */
            .filter-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                padding: 15px 20px;
                margin-bottom: 20px;
            }

            .filter-group {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .filter-select {
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid var(--border);
                background-color: white;
                font-family: 'Inter', sans-serif;
            }

            .date-range {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .date-input {
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid var(--border);
                font-family: 'Inter', sans-serif;
            }

            /* Stats Cards */
            .stats-cards {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin-bottom: 20px;
            }

            .stat-card {
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                padding: 20px;
            }

            .stat-card h3 {
                font-size: 0.9rem;
                color: var(--gray);
                margin-bottom: 10px;
            }

            .stat-card p {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--dark);
            }

            /* Table Styles */
            .table-container {
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }

            .table-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--border);
            }

            .table-title {
                font-size: 1.2rem;
                font-weight: 600;
            }

            .search-box {
                position: relative;
            }

            .search-box input {
                padding: 8px 15px 8px 35px;
                border-radius: 6px;
                border: 1px solid var(--border);
                width: 250px;
                transition: all 0.3s;
            }

            .search-box input:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.2);
            }

            .search-box i {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--gray);
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            thead th {
                text-align: left;
                padding: 15px 20px;
                font-weight: 600;
                color: var(--gray);
                background-color: var(--light);
                border-bottom: 1px solid var(--border);
            }

            tbody tr {
                border-bottom: 1px solid var(--border);
                transition: background-color 0.3s;
            }

            tbody tr:hover {
                background-color: rgba(58, 134, 255, 0.05);
            }

            tbody td {
                padding: 15px 20px;
                vertical-align: middle;
            }

            .checkbox-cell {
                width: 40px;
            }

            .checkbox-cell input {
                width: 16px;
                height: 16px;
                cursor: pointer;
            }

            .order-cell {
                display: flex;
                flex-direction: column;
            }

            .order-id {
                font-weight: 500;
                margin-bottom: 3px;
            }

            .order-date {
                font-size: 0.8rem;
                color: var(--gray);
            }

            .customer-cell {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .customer-avatar {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                object-fit: cover;
            }

            .customer-info {
                display: flex;
                flex-direction: column;
            }

            .customer-name {
                font-weight: 500;
            }

            .customer-email {
                font-size: 0.8rem;
                color: var(--gray);
            }

            .status-badge {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 500;
            }

            .status-pending {
                background-color: rgba(255, 190, 11, 0.1);
                color: var(--warning);
            }

            .status-processing {
                background-color: rgba(58, 134, 255, 0.1);
                color: var(--primary);
            }

            .status-completed {
                background-color: rgba(6, 214, 160, 0.1);
                color: var(--success);
            }

            .status-cancelled {
                background-color: rgba(239, 71, 111, 0.1);
                color: var(--danger);
            }

            .price-cell {
                font-weight: 600;
            }

            .action-cell {
                position: relative;
                width: 80px;
            }

            .action-btn {
                background: none;
                border: none;
                cursor: pointer;
                color: var(--gray);
                font-size: 1.2rem;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                transition: all 0.3s;
            }

            .action-btn:hover {
                background-color: var(--gray-light);
                color: var(--dark);
            }

            .action-menu {
                position: absolute;
                right: 10px;
                top: 40px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                padding: 10px 0;
                width: 180px;
                z-index: 10;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s;
            }

            .action-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .action-menu button {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 8px 15px;
                background: none;
                border: none;
                text-align: left;
                cursor: pointer;
                transition: all 0.3s;
            }

            .action-menu button:hover {
                background-color: var(--gray-light);
            }

            .action-menu i {
                margin-right: 10px;
                width: 20px;
                color: var(--gray);
            }

            .action-menu .view i {
                color: var(--primary);
            }

            .action-menu .process i {
                color: var(--warning);
            }

            .action-menu .complete i {
                color: var(--success);
            }

            .action-menu .cancel i {
                color: var(--danger);
            }

            .table-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-top: 1px solid var(--border);
            }

            .pagination {
                display: flex;
                gap: 10px;
            }

            .pagination button {
                width: 35px;
                height: 35px;
                border-radius: 6px;
                border: 1px solid var(--border);
                background: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .pagination button:hover {
                background-color: var(--gray-light);
            }

            .pagination button.active {
                background-color: var(--primary);
                color: white;
                border-color: var(--primary);
            }

            /* Mobile Orders List */
            .mobile-orders-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 15px;
            }

            .mobile-order-card {
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                cursor: pointer;
                transition: all 0.2s;
            }

            .mobile-order-card:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .mobile-order-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }

            .mobile-order-id {
                font-weight: 600;
                color: var(--primary);
            }

            .mobile-order-date {
                font-size: 0.8rem;
                color: var(--gray);
            }

            .mobile-order-customer {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .mobile-customer-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
            }

            .mobile-customer-info {
                flex: 1;
            }

            .mobile-customer-name {
                font-weight: 500;
            }

            .mobile-customer-email {
                font-size: 0.8rem;
                color: var(--gray);
            }

            .mobile-order-details {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 10px;
            }

            .mobile-order-status {
                grid-column: 1;
            }

            .mobile-order-payment {
                grid-column: 2;
                text-align: center;
                font-size: 0.9rem;
            }

            .mobile-order-total {
                grid-column: 3;
                text-align: right;
                font-weight: 600;
            }

            .mobile-order-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            /* Order Detail Sidebar */
            .detail-sidebar {
                position: fixed;
                top: 0;
                right: -400px;
                width: 400px;
                height: 100%;
                background: white;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
                z-index: 99;
                transition: right 0.3s ease-in-out;
                overflow-y: auto;
            }

            .detail-sidebar.open {
                right: 0;
            }

            .sidebar-header {
                padding: 20px;
                border-bottom: 1px solid var(--gray-light);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .sidebar-header h3 {
                font-size: 1.3rem;
                color: var(--dark);
            }

            .close-sidebar {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--gray);
                transition: color 0.3s;
            }

            .close-sidebar:hover {
                color: var(--danger);
            }

            .order-detail {
                padding: 20px;
            }

            .order-header {
                margin-bottom: 20px;
            }

            .order-info-header h4 {
                font-size: 1.4rem;
                margin-bottom: 5px;
            }

            .order-info-header p {
                color: var(--gray);
                margin-bottom: 10px;
            }

            .order-status {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 500;
            }

            .detail-section {
                margin-bottom: 25px;
            }

            .detail-section h5 {
                font-size: 1rem;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid var(--gray-light);
                color: var(--gray);
            }

            .detail-row {
                display: flex;
                margin-bottom: 12px;
            }

            .detail-label {
                width: 120px;
                font-weight: 500;
                color: var(--gray);
            }

            .detail-value {
                flex: 1;
            }

            .customer-details {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
            }

            .customer-avatar-lg {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
            }

            .customer-info-lg {
                flex: 1;
            }

            .customer-name-lg {
                font-weight: 600;
                margin-bottom: 5px;
            }

            .customer-meta {
                font-size: 0.9rem;
                color: var(--gray);
            }

            .products-list {
                margin-top: 15px;
            }

            .product-item {
                display: flex;
                gap: 15px;
                padding: 10px 0;
                border-bottom: 1px solid var(--gray-light);
            }

            .product-item:last-child {
                border-bottom: none;
            }

            .product-image-sm {
                width: 60px;
                height: 60px;
                border-radius: 6px;
                object-fit: cover;
            }

            .product-info-sm {
                flex: 1;
            }

            .product-name-sm {
                font-weight: 500;
                margin-bottom: 5px;
            }

            .product-sku-sm {
                font-size: 0.8rem;
                color: var(--gray);
                margin-bottom: 5px;
            }

            .product-price {
                font-weight: 600;
            }

            .order-summary {
                background-color: var(--light);
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
            }

            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }

            .summary-total {
                font-weight: 600;
                font-size: 1.1rem;
                padding-top: 10px;
                border-top: 1px solid var(--border);
            }

            .action-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }

            /* Status Update Modal */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s;
            }

            .modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .modal {
                background-color: white;
                border-radius: 10px;
                width: 100%;
                max-width: 500px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                transform: translateY(-20px);
                transition: all 0.3s;
            }

            .modal-overlay.active .modal {
                transform: translateY(0);
            }

            .modal-header {
                padding: 20px;
                border-bottom: 1px solid var(--gray-light);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-header h3 {
                font-size: 1.3rem;
            }

            .modal-body {
                padding: 20px;
            }

            .modal-message {
                margin-bottom: 20px;
                line-height: 1.6;
            }

            .status-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;
            }

            .status-option {
                display: flex;
                align-items: center;
                padding: 10px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .status-option:hover {
                background-color: var(--gray-light);
            }

            .status-option input {
                margin-right: 10px;
            }

            .status-option .status-badge {
                margin-left: auto;
            }

            .modal-footer {
                padding: 15px 20px;
                border-top: 1px solid var(--gray-light);
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            /* Text Colors */
            .text-success {
                color: var(--text-success);
            }

            .text-danger {
                color: var(--text-danger);
            }

            @media (max-width: 768px) {
                .filter-bar {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
                }

                .table-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
                }

                .search-box input {
                width: 100%;
                }

                .table-footer {
                flex-direction: column;
                gap: 15px;
                align-items: flex-start;
                }

                .detail-sidebar {
                width: 100%;
                right: -100%;
                }

                .main-content.sidebar-open {
                margin-right: 0;
                transform: translateX(-100%);
                }

                .modal {
                margin: 0 20px;
                }
            }

            @media (max-width: 576px) {
                .header h1 {
                font-size: 1.4rem;
                }

                .user-menu span {
                display: none;
                }

                .stats-cards {
                grid-template-columns: 1fr;
                }

                .modal-footer {
                flex-direction: column;
                }

                .modal-footer .btn {
                width: 100%;
                }
            }
            `}</style>
        </div>
    );
};

export default Order;