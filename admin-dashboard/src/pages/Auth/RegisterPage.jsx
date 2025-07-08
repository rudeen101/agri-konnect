import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLock, 
  faBuilding,
  faIdCard,
  faExclamationCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
// import './Auth.css';
import Logo from '../../assets/images/agrikonnect-logo.jpg';
import { postDataToApi } from '../../services/apiCalls';
import { useAuth } from '../../contexts/AuthContext';
import { MdBusinessCenter } from "react-icons/md";
import { MdAddBusiness } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";




const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    businessName: '',
    businessAddress: '',
    businessCity: '',
    businessCounty: '',
    businessDescription: '',
    // businessLicense: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value ? '' : 'Full name is required';
      case 'contact':
        return value ? '' : 'email or phone number is required';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      case 'businessName':
        if (formData.role === 'seller' && !value) return 'Business name is required';
        return '';
      case 'businessAddress':
        if (formData.role === 'seller' && !value) return 'Business address is required';
        return '';
      case 'businessCity':
        if (formData.role === 'seller' && !value) return 'Business city is required';
        return '';
      case 'businessCounty':
        if (formData.role === 'seller' && !value) return 'Business county is required';
        return '';
    //   case 'businessLicense':
    //     if (formData.role === 'seller' && !value) return 'Business license is required';
    //     return '';
    //   case 'employeeId':
    //     if (formData.role === 'agent' && !value) return 'Employee ID is required';
    //     return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      if (key !== 'remember' && key !== 'name' && key !== 'contact' && key !== 'password') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // setNotification({ show: false, message: '', type: 'success' });

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        contact: formData.contact,
        password: formData.password,
        role: formData.role,
      };

      // Add role-specific data
      if (formData.role === 'seller') {
            userData.businessName = formData.businessName;
            userData.businessAddress = formData.businessAddress;
            userData.businessCity = formData.businessCity;
            userData.businessCounty = formData.businessCounty;
            userData.businessDescription = formData.businessDescription
        //   businessLicense: formData.businessLicense
      } 

      console.log(userData);
      const response = await postDataToApi("/api/v1/auth/register", userData);

      console.log(userData);
      
    //   Automatically log in the user after registration
      await login({
        contact: formData.contact,
        password: formData.password
      });

      // Redirect based on role
    //   navigate(formData.role === 'seller' ? '/seller/dashboard' : '/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      setNotification({
        show: true,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>
            <img src={Logo} alt="Agri-Konnect Logo" />
            Agri-Konnect
          </h1>
          <p>Create your account</p>
        </div>

        <div className="auth-body">
          {notification.show && (
            <div className={`notification ${notification.type} show`}>
              <FontAwesomeIcon 
                icon={notification.type === 'error' ? faExclamationCircle : faCheckCircle} 
              />
              <span>{notification.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="name">Full Name*</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faUser} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className={`form-group ${errors.contact ? 'has-error' : ''}`}>
              <label htmlFor="contact">Email or Phone Number*</label>
              <div className="input-group">
                {/* <FontAwesomeIcon icon={faPhone} /> */}
                <FaAddressCard></FaAddressCard>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  placeholder="Enter your email phone number"
                  value={formData.contact}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {errors.contact && <div className="error-message">{errors.contact}</div>}
            </div>

            <div className="password-fields">
              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label htmlFor="password">Password*</label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faLock} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faLock} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type*</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {formData.role === 'seller' && (
              <div className="seller-fields">
                <h3>Seller Information</h3>
                <div className={`form-group ${errors.businessName ? 'has-error' : ''}`}>
                  <label htmlFor="businessName">Business Name*</label>
                  <div className="input-group">
                    {/* <FontAwesomeIcon icon={faBuilding} /> */}
                    <MdBusinessCenter></MdBusinessCenter>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      placeholder="Your business name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required={formData.role === 'seller'}
                    />
                  </div>
                  {errors.businessName && <div className="error-message">{errors.businessName}</div>}
                </div>


                <div className={`form-group ${errors.businessCity ? 'has-error' : ''}`}>
                  <label htmlFor="businessAddress">Address*</label>
                  <div className="input-group">
                    <MdAddBusiness></MdAddBusiness>
                    <input
                      type="text"
                      id="businessAddress"
                      name="businessAddress"
                      placeholder="Your business Address"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required={formData.role === 'seller'}
                    />
                  </div>
                  {errors.businessAddress && <div className="error-message">{errors.businessAddress}</div>}
                </div>

                <div className={`form-group ${errors.businessCity ? 'has-error' : ''}`}>
                  <label htmlFor="businessCity">City*</label>
                  <div className="input-group">
                    {/* <FontAwesomeIcon icon={faBuilding} /> */}
                    {/* <FaLocationDot></FaLocationDot> */}
                    <FaMapLocationDot></FaMapLocationDot>

                    <input
                      type="text"
                      id="businessCity"
                      name="businessCity"
                      placeholder="Your business City"
                      value={formData.businessCity}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required={formData.role === 'seller'}
                    />
                  </div>
                  {errors.businessCity && <div className="error-message">{errors.businessCity}</div>}
                </div>

                <div className={`form-group ${errors.businessCounty ? 'has-error' : ''}`}>
                  <label htmlFor="businessCounty">County*</label>
                  <div className="input-group">
                    {/* <FontAwesomeIcon icon={faBuilding} /> */}
                    <FaMapLocationDot></FaMapLocationDot>
                    <input
                      type="text"
                      id="businessCounty"
                      name="businessCounty"
                      placeholder="Your business County"
                      value={formData.businessCounty}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required={formData.role === 'seller'}
                    />
                  </div>
                  {errors.businessCounty && <div className="error-message">{errors.businessCounty}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="businessDescription">Business Description</label>
                    <textarea
                    id="businessDescription"
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows="3"
                    />
                </div>
                {/* <div className={`form-group ${errors.businessLicense ? 'has-error' : ''}`}>
                  <label htmlFor="businessLicense">Business License*</label>
                  <div className="input-group">
                    <FontAwesomeIcon icon={faIdCard} />
                    <input
                      type="text"
                      id="businessLicense"
                      name="businessLicense"
                      placeholder="Business license number"
                      value={formData.businessLicense}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required={formData.role === 'seller'}
                    />
                  </div>
                  {errors.businessLicense && <div className="error-message">{errors.businessLicense}</div>}
                </div> */}
              </div>
            )}

            <div className="form-group terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="divider">OR</div>

            <div className="social-login">
              <a href="/api/v1/auth/google">
                <button type="button" className="social-btn google">
                  <FontAwesomeIcon icon={faGoogle} />
                  <span>Sign up with Google</span>
                </button>
              </a>
            </div>

            <div className="auth-footer">
              Already have an account? <a href="/login">Log in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;