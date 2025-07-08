import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, 
    faEnvelope, 
    faLock, 
    faCheckCircle, 
    faExclamationCircle,
    faSpinner,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { 
    faGoogle, 
    faGithub 
} from '@fortawesome/free-brands-svg-icons';
import './Auth.css'; 
import Logo from '../../assets/images/agrikonnect-logo.jpg'; 
import { postDataToApi } from '../../services/apiCalls'; 
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';


const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const modalRef = useRef(null);

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
            let contact = email.trim();
            await postDataToApi("/api/v1/auth/forgot-password", { contact });
            setIsSuccess(true);
            setTimeout(onClose, 3000);
        } catch (error) {
            console.error('Error:', error);
            setEmailError('Failed to send reset link');
        } finally {
            setIsSubmitting(false);
        }
    };

    

    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setEmailError('');
            setIsSubmitting(false);
            setIsSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="forgot-password-modal" ref={modalRef}>
                <div className="modal-header">
                    <h2>Forgot Password</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                
                <div className="modal-body">
                    {!isSuccess ? (
                        <>
                            <p>Enter your email address and we'll send you a link to reset your password.</p>
                            <form onSubmit={handleSubmit}>
                                <div className={`form-group ${emailError ? 'has-error' : ''}`}>
                                    <label htmlFor="forgot-email">Email Address</label>
                                    <div className="input-group">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                        <input
                                            type="email"
                                            id="forgot-email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            disabled={isSubmitting}
                                            onBlur={validateEmail}
                                        />
                                    </div>
                                    {emailError && <div className="error-message">{emailError}</div>}
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting || !email}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="success-message">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            <span>Reset link sent successfully!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Login = () => {
    const [formData, setFormData] = useState({
        contact: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = useState({
        contact: '',
        password: ''
    });

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    const { login } = useAuth();
    const { isLoading, setIsLoading } = useAppContext();


    // ... (keep all your existing functions like validatePassword, handleInputChange, etc.)
    const validatePassword = (password) => {
        return password.length >= 6;
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
        let error = '';

        if (name === 'contact') {
            if (!value) {
                error = 'Email or phone number is required';
            } else if (!value) {
                error = 'Please enter a valid email or phone number';
            }
        } else if (name === 'password') {
            if (!value) {
                error = 'Password is required';
            } else if (!validatePassword(value)) {
                error = 'Password must be at least 6 characters';
            }
        }

        setErrors({
            ...errors,
            [name]: error
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate inputs
        let isValid = true;
        const newErrors = { ...errors };

        if (!formData.contact) {
            newErrors.contact = 'Email or phone number is required';
            isValid = false;
        } else if (!formData.contact) {
            newErrors.contact = 'Please enter a valid email or phone number';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) return;

        // Login in user
        login(formData)
        setIsLoading(true);


    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setShowForgotPassword(true);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>
                        <img src={Logo} alt="Agri-Konnect Logo" />
                        Agri-Konnect
                    </h1>
                    <p>Sign in to your admin dashboard</p>
                </div>

                <div className="auth-body">
                    <form onSubmit={handleSubmit}>
                         <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                            <label htmlFor="email">Email Address</label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faEnvelope} />
                                <input
                                    type="contact"
                                    id="contact"
                                    name="contact"
                                    placeholder="Enter your email or phone number"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <div className="error-message">{errors.contact}</div>
                            )}
                        </div>
                        <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                            <label htmlFor="password">Password</label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faLock} />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                            {errors.password && (
                                <div className="error-message">{errors.password}</div>
                            )}
                        </div>
                        <div className="remember-forgot">
                            <div className="remember-me">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <div className="forgot-password">
                                <a      
                                    className="forgot-password-btn"
                                    onClick={handleForgotPassword}
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="divider">OR</div>


                        <div className="social-login">
                            <a href="http://localhost:5000/api/v1/auth/google">
                                <button
                                    type="button"
                                    className="social-btn google"
                                    // onClick={() => handleSocialLogin('Google')}
                                >
                                    <FontAwesomeIcon icon={faGoogle} />
                                    <span>Google</span>
                                </button>
                            </a>
                            {/* <button
                                type="button"
                                className="social-btn github"
                                onClick={() => handleSocialLogin('GitHub')}
                            >
                                <FontAwesomeIcon icon={faGithub} />
                                <span>GitHub</span>
                            </button> */}
                        </div>

                        <div className="login-footer">
                            Don't have an account? <a href="#">Request access</a>
                        </div>
                    </form>
                </div>
            </div>

            {notification.show && (
                <div className={`notification ${notification.type} show`}>
                    <FontAwesomeIcon 
                        icon={notification.type === 'error' ? faExclamationCircle : faCheckCircle} 
                    />
                    <span>{notification.message}</span>
                </div>
            )}

            {showForgotPassword && (
                <ForgotPasswordModal
                    isOpen={showForgotPassword}
                    onClose={() => {
                    setShowForgotPassword(false);
                    }}
                />
            )}
        </div>
    );
};

export default Login;