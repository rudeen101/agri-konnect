import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLock, 
  faCheckCircle, 
  faExclamationCircle, 
  faSpinner,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import { postDataToApi } from '../../services/apiCalls';
import './Auth.css';
import logo from '../../assets/images/logo2.jpg'; // Adjust the path as necessary

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  });
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const path = window.location.pathname;
	const id = path.split('/').pop();

  console.log('Reset Password ID:', id);

  useEffect(() => {
    // Check password strength when newPassword changes
    if (formData.newPassword) {
      setPasswordStrength({
        length: formData.newPassword.length >= 8,
        uppercase: /[A-Z]/.test(formData.newPassword),
        number: /\d/.test(formData.newPassword),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
      });
    }
  }, [formData.newPassword]);

  const validatePassword = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setNotification({
        ...notification,
        show: false
      });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);

    try {
      const response = await postDataToApi(`/api/v1/auth/reset-password/${id}`, {
        password: formData.newPassword
      });

      if (response.success) {
        setIsSuccess(true);
        showNotification('Password updated successfully!', 'success');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        showNotification(response.message || 'Failed to reset password', 'error');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      showNotification('An error occurred while resetting password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="password-reset-success">
            <FontAwesomeIcon icon={faCheckCircle} />
            <h2>Password Reset Successful!</h2>
            <p>Your password has been updated successfully.</p>
            <button 
              className="reset-password-btn success-btn"
              onClick={() => navigate('/login')}
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
            <img src={logo} style={{ width: '100px', height: 'auto' }} alt="" />
          <h1>Reset Your Password</h1>
          <p>Create a new secure password for your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.newPassword ? 'has-error' : ''}`}>
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={formData.showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
              <FontAwesomeIcon
                icon={formData.showPassword ? faEyeSlash : faEye}
                className="password-toggle"
                onClick={() => togglePasswordVisibility('showPassword')}
              />
            </div>
            {errors.newPassword && (
              <div className="error-message">{errors.newPassword}</div>
            )}
          </div>

          {/* <div className="password-strength">
            <h4>Password Requirements</h4>
            <ul>
              <li className={passwordStrength.length ? 'valid' : ''}>
                Minimum 8 characters
              </li>
              <li className={passwordStrength.uppercase ? 'valid' : ''}>
                At least one uppercase letter
              </li>
              <li className={passwordStrength.number ? 'valid' : ''}>
                At least one number
              </li>
              <li className={passwordStrength.specialChar ? 'valid' : ''}>
                At least one special character
              </li>
            </ul>
          </div> */}

          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={formData.showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <FontAwesomeIcon
                icon={formData.showConfirmPassword ? faEyeSlash : faEye}
                className="password-toggle"
                onClick={() => togglePasswordVisibility('showConfirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="reset-password-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Resetting Password...</span>
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {notification.show && (
          <div className={`notification ${notification.type} show`}>
            <FontAwesomeIcon 
              icon={notification.type === 'error' ? faExclamationCircle : faCheckCircle} 
            />
            <span>{notification.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;