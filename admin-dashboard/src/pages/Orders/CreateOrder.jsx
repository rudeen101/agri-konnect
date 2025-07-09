import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCubes, faTachometerAlt, faShoppingCart, faPlusCircle, 
  faBox, faUsers, faTimes, faSave, faPlus, faTrash
} from '@fortawesome/free-solid-svg-icons';
import "./Order.css";
import { Link } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Header from "../../components/layout/Header/Header";
import { fetchDataFromApi, postDataToApi } from '../../utils/apiCalls';
import { useAppContext } from '../../contexts/AppContext'; 
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
  // Form state
  const [formData, setFormData] = useState({
    // customer: '',
    orderItems: [
      { product: '', name: "", images: [], price: 0, quantity: 1, discount: 0, total: 0,}
    ],
    shippingAddress: {
      address: '',
      city: '',
      county: '',
      // postalCode: '',
      // country: '',
      isBusiness: false,
      businessName: ''
    },
    paymentMethod: '',
    shippingMethod: 'standard',
    notes: '',
    itemsPrice: 0,
    shippingPrice: 0,
    // taxPrice: 0,
    discountAmount: 0,
    totalPrice: 0
  });

  // UI state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: '',
    // network: '',
    accountName: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [products, setProducts] = useState([]);

  // Sample products data
  // const products = [
  //   { id: '1', name: 'iPhone 13 Pro', price: 999, image: 'iphone.jpg' },
  //   { id: '2', name: 'MacBook Pro 14"', price: 1999, image: 'macbook.jpg' },
  //   { id: '3', name: 'AirPods Pro', price: 249, image: 'airpods.jpg' }
  // ];

  const context = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
  // Fetch user data from API
      fetchDataFromApi('/api/v1/product').then((res) =>{
        console.log("products", res)
        setProducts(res.data);
      }).catch((error) => {
          console.error('Error fetching products data:', error);
      });
  }, []);

  // Calculate totals whenever order items change
  useEffect(() => {
    calculateTotals();
  }, [formData.orderItems, formData.shippingMethod]);

  const calculateTotals = () => {
    const itemsPrice = formData.orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity - item.discount), 
      0
    );

    const shippingPrice = formData.shippingMethod === 'express' ? 9.99 : 
      formData.shippingMethod === 'priority' ? 19.99 : 0;

    // const taxPrice = itemsPrice * 0.1; // 10% tax for example
    // const totalPrice = itemsPrice + shippingPrice + taxPrice;
    const totalPrice = itemsPrice + shippingPrice;

    setFormData(prev => ({
      ...prev,
      itemsPrice,
      shippingPrice,
      // taxPrice,
      totalPrice
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    console.log(name, value)
    const updatedItems = [...formData.orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: name === 'product' ? value : Number(value)
    };

    // Update price when product changes
    if (name === 'product') {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        updatedItems[index].name = selectedProduct.name;
        updatedItems[index].price = selectedProduct.price;
        updatedItems[index].images = selectedProduct.images;
        updatedItems[index].total = selectedProduct.price * updatedItems[index].quantity;
      }
    }

    // Recalculate total when quantity or discount changes
    if (name === 'quantity' || name === 'discount') {
      updatedItems[index].total = 
        (updatedItems[index].price * updatedItems[index].quantity) - updatedItems[index].discount;
    }

    setFormData(prev => ({
      ...prev,
      orderItems: updatedItems
    }));
  };

  // Add new empty item row
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        { product: '', price: 0, quantity: 1, discount: 0, total: 0 }
      ]
    }));
  };

  // Remove item row
  const removeItem = (index) => {
    const updatedItems = formData.orderItems.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      orderItems: updatedItems
    }));
  };

  // Handle payment method selection
  const handlePaymentSelect = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
    setShowPaymentModal(true);
  };

  // Handle payment details input
  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit payment
  const submitPayment = async (e) => {
    e.preventDefault();
    // setPaymentProcessing(true);
    setShowAccountDetails(true);
    setShowPaymentModal(false);


    // Simulate API call
    // try {
    //   await new Promise(resolve => setTimeout(resolve, 2000));
    //   setPaymentSuccess(true);
      
    //   // In a real app, you would submit the entire order here
    //   console.log('Order submitted:', {
    //     ...formData,
    //     paymentDetails,
    //     isPaid: true,
    //     paidAt: new Date().toISOString()
    //   });

    //   setTimeout(() => {
    //     setShowPaymentModal(false);
    //     setPaymentProcessing(false);
    //     setPaymentSuccess(false);
    //   }, 2000);
    // } catch (error) {
    //   console.error('Payment failed:', error);
    //   setPaymentProcessing(false);
    // }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    // setPaymentProcessing(true);
    setShowAccountDetails(true);
    setShowPaymentModal(false);

    const orderData = {
        ...formData,
        paymentDetails,
        isPaid: true,
        paidAt: new Date().toISOString()
    }

    console.log(orderData)

    const response = await postDataToApi('/api/v1/order/create', orderData)

    if (response.success) {
      // Show success message
      context.showNotification(`Order placed successfully!`, 'success');
      
      // Redirect to categories list or do something else
      navigate('/orders'); // If using React Router
    } else {
      context.showNotification(`Error placing order, try again!`, 'error');
      throw new Error(response.message || 'Operation failed');
    }


    // Simulate API call
    // try {
    //   await new Promise(resolve => setTimeout(resolve, 2000));
    //   setPaymentSuccess(true);
      
    //   // In a real app, you would submit the entire order here
    //   console.log('Order submitted:', {
    //     ...formData,
    //     paymentDetails,
    //     isPaid: true,
    //     paidAt: new Date().toISOString()
    //   });

    //   setTimeout(() => {
    //     setShowPaymentModal(false);
    //     setPaymentProcessing(false);
    //     setPaymentSuccess(false);
    //   }, 2000);
    // } catch (error) {
    //   console.error('Payment failed:', error);
    //   setPaymentProcessing(false);
    // }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
          <Header />
          <div className="dashboard-section">
                  
            {/* Main Content */}
            <main className="">
              <div className="header">
                <h1 className="page-title">Create New Order</h1>
              </div>
              <form id="orderForm">
                {/* Customer Information */}
                {/* <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Customer Information</h2>
                  </div>
                  <div className="form-group">
                    <label htmlFor="customer" className="form-label">Customer *</label>
                    <select 
                      id="customer" 
                      name="customer"
                      className="form-select" 
                      required
                      value={formData.customer}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a customer</option>
                      <option value="1">John Doe (john@example.com)</option>
                      <option value="2">Jane Smith (jane@example.com)</option>
                    </select>
                  </div>
                </div> */}

                {/* Order Items */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Order Items</h2>
                    <button 
                      type="button" 
                      className="order-btn btn-primary" 
                      onClick={addItem}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add Item
                    </button>
                  </div>
                  <table className="order-items">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>

                        {/* orderItems: [
                          { product: '', name: "", price: 0, quantity: 1, discount: 0, }
                        ], */}
                    <tbody id="orderItemsBody">
                      {formData.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <select 
                              className="form-control product-select"
                              name="product"
                              value={item.product}
                              onChange={(e) => handleItemChange(index, e)}
                            >
                              <option value="">Select product</option>
                              {products.map(product => (
                                <option key={product.id} value={product?.id}>
                                  {product?.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <div className="quantity-control">
                              <button 
                                type="button" 
                                className="btn btn-sm"
                                onClick={() => {
                                  const newQty = Math.max(1, item.quantity - 1);
                                  handleItemChange(index, {
                                    target: { name: 'quantity', value: newQty }
                                  });
                                }}
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                className="form-control quantity-input" 
                                name="quantity"
                                value={item.quantity}
                                min="1"
                                onChange={(e) => handleItemChange(index, e)}
                              />
                              <button 
                                type="button" 
                                className="btn btn-sm"
                                onClick={() => {
                                  const newQty = item.quantity + 1;
                                  handleItemChange(index, {
                                    target: { name: 'quantity', value: newQty }
                                  });
                                }}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            <input 
                              type="number" 
                              className="form-control" 
                              name="discount"
                              value={item.discount}
                              min="0" 
                              step="0.01"
                              onChange={(e) => handleItemChange(index, e)}
                            />
                          </td>
                          <td>${item.total.toFixed(2)}</td>
                          <td>
                            <FontAwesomeIcon 
                              icon={faTrash} 
                              className="remove-item"
                              onClick={() => removeItem(index)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Shipping Information */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Shipping Information</h2>
                  </div>
                  <div className="form-group">
                    <label className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        name="isBusiness"
                        checked={formData.shippingAddress.isBusiness}
                        onChange={handleAddressChange}
                      />
                      Same as billing address
                    </label>
                  </div>
                  <div className="form-group">
                    <label htmlFor="address" className="form-label">Address *</label>
                    <input 
                      type="text" 
                      id="address" 
                      name="address"
                      className="form-control" 
                      required
                      value={formData.shippingAddress.address}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City *</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city"
                      className="form-control" 
                      required
                      value={formData.shippingAddress.city}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">County *</label>
                    <input 
                      type="text" 
                      id="county" 
                      name="county"
                      className="form-control" 
                      required
                      value={formData.shippingAddress.county}
                      onChange={handleAddressChange}
                    />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="postalCode" className="form-label">Postal Code *</label>
                    <input 
                      type="text" 
                      id="postalCode" 
                      name="postalCode"
                      className="form-control" 
                      required
                      value={formData.shippingAddress.postalCode}
                      onChange={handleAddressChange}
                    />
                  </div> */}
                  {/* <div className="form-group">
                    <label htmlFor="country" className="form-label">Country *</label>
                    <select 
                      id="country" 
                      name="country"
                      className="form-select" 
                      required
                      value={formData.shippingAddress.country}
                      onChange={handleAddressChange}
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CM">Cameroon</option>
                    </select>
                  </div> */}
                  <div className="form-group">
                    <label className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        name="isBusiness"
                        checked={formData.shippingAddress.isBusiness}
                        onChange={handleAddressChange}
                      />
                      This is a business address
                    </label>
                  </div>
                  {formData.shippingAddress.isBusiness && (
                    <div className="form-group" id="businessNameGroup">
                      <label htmlFor="businessName" className="form-label">Business Name</label>
                      <input 
                        type="text" 
                        id="businessName" 
                        name="businessName"
                        className="form-control"
                        value={formData.shippingAddress.businessName}
                        onChange={handleAddressChange}
                      />
                    </div>
                  )}
                </div>

                {/* Payment & Summary */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Payment & Summary</h2>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Method *</label>
                    <div className="payment-methods">
                      <button
                        type="button"
                        className={`payment-method-btn ${formData.paymentMethod === 'orange' ? 'active' : ''}`}
                        onClick={() => handlePaymentSelect('orange')}
                      >
                        Orange Money
                      </button>
                      <button
                        type="button"
                        className={`payment-method-btn ${formData.paymentMethod === 'mtn' ? 'active' : ''}`}
                        onClick={() => handlePaymentSelect('mtn')}
                      >
                        MTN Mobile Money
                      </button>
                    </div>

                    
                  </div>
                  
                  <div className="summary-grid">
                   
                    <div>
                      {
                        showAccountDetails && (
                          <div className="card">
                            <div className="account-details">
                              <span className='title'>Account Name:</span>
                              <span>{paymentDetails?.accountName}</span>
                            </div>
                            <div className="account-details">
                              <span className='title'>Account Number:</span>
                              <span>{paymentDetails?.phoneNumber}</span>
                            </div>
                          </div>
                        )
                      }
                     
                      <div className="form-group">
                        <label htmlFor="shippingMethod" className="form-label">Shipping Method</label>
                        <select 
                          id="shippingMethod" 
                          name="shippingMethod"
                          className="form-select"
                          value={formData.shippingMethod}
                          onChange={handleInputChange}
                        >
                          <option value="standard">Standard Shipping (Free)</option>
                          <option value="express">Express Shipping ($9.99)</option>
                          <option value="priority">Priority Shipping ($19.99)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="notes" className="form-label">Order Notes</label>
                        <textarea 
                          id="notes" 
                          name="notes"
                          className="form-control" 
                          rows="3"
                          value={formData.notes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>

                            <div className="form-actions ">
                    <button type="button" className="btn btn-outline" id="cancelBtn">
                        <i className="fas fa-times"></i> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" onClick={handlePlaceOrder} >
                        <i className="fas fa-save"></i> Place Order
                    </button>
                  </div>
                    </div>
                    
                    <div>
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Order Summary</h3>
                        </div>
                        <div className="summary-item">
                          <span>Subtotal:</span>
                          <span>${formData.itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-item">
                          <span>Shipping:</span>
                          <span>${formData.shippingPrice.toFixed(2)}</span>
                        </div>
                        {/* <div className="summary-item">
                          <span>Tax:</span>
                          <span>${formData.taxPrice.toFixed(2)}</span>
                        </div> */}
                        <div className="summary-item">
                          <span>Discount:</span>
                          <span>${formData.discountAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-item summary-total">
                          <span>Total:</span>
                          <span>${formData.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="card">
            
                </div> */}
              </form>
            </main>

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="order-modal-container">
                <div className="order-modal-overlay">
                  <div className="modal">
                    <div className="order-modal-header">
                      <h3>
                        {formData.paymentMethod === 'orange' ? 'Orange Money' : 'MTN Mobile Money'} Payment
                      </h3>
                      <button 
                        className="close-btn"
                        onClick={() => {
                          setShowPaymentModal(false);
                          setPaymentDetails({
                            phoneNumber: '',
                            network: formData.paymentMethod,
                            accountName: ''
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                    <div className="order-modal-body">
                      {paymentSuccess ? (
                        <div className="payment-success">
                          <div className="success-icon">✓</div>
                          <h4>Payment Successful!</h4>
                          <p>Your order has been placed successfully.</p>
                        </div>
                      ) : (
                        <form onSubmit={submitPayment}>
                          <div className="form-group">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
                            <input
                              type="tel"
                              id="phoneNumber"
                              name="phoneNumber"
                              className="form-control"
                              placeholder="Enter your account phone number"
                              required
                              value={paymentDetails.phoneNumber}
                              onChange={handlePaymentDetailsChange}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="accountName" className="form-label">Account Name *</label>
                            <input
                              type="text"
                              id="accountName"
                              name="accountName"
                              className="form-control"
                              placeholder="Enter your account name"
                              required
                              value={paymentDetails.accountName}
                              onChange={handlePaymentDetailsChange}
                            />
                          </div>
                          {/* <div className="payment-amount">
                            <span>Amount to pay:</span>
                            <span>${formData.totalPrice.toFixed(2)}</span>
                          </div> */}
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={paymentProcessing}
                          >
                            Done
                            {/* {paymentProcessing ? 'Processing...' : 'Confirm Payment'} */}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default CreateOrder;