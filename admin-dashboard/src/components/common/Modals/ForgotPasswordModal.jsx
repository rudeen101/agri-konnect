import { useState, useRef, useEffect } from 'react';
import { FaEnvelope, FaCheckCircle, FaTimes } from 'react-icons/fa';
import './Modal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef(null);


  useEffect(() => {


      const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose();
    }
  };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
        alert(isOpen)

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsSubmitting(true);
    
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setEmail('');
    setEmailError('');
    setIsSubmitting(false);
    setIsSuccess(false);
    // Call parent's close handler
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="forgot-password-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Forgot Password</h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          {!isSuccess ? (
            <>
              <p>Enter your email address and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit}>
                <div className={`form-group ${emailError ? 'error' : ''}`}>
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                      onBlur={validateEmail}
                    />
                    <FaEnvelope className="input-icon" />
                  </div>
                  {emailError && <span className="error-message">{emailError}</span>}
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <FaCheckCircle />
              <span>Reset link sent successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;