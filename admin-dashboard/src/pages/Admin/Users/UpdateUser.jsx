import React, { useState, useEffect, useContext } from 'react';
import useImageUpload from '../../../hooks/useImageUpload';
import { useAppContext } from '../../../contexts/AppContext'; 
import { fetchDataFromApi, uploadImage, deleteImages, updateDataToApi, deleteDataFromApi, postDataToApi } from '../../../utils/apiCalls';
import '../../Index.css';
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import Header from "../../../components/layout/Header/Header";


const UpdateUser = () => {
    // State for basic information
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        status: '',
        avatar: 'https://via.placeholder.com/80'
    });

    // State for password change
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const context = useAppContext();
    const {id} = useParams();
    const navigate = useNavigate();

    const { 
        previews,
        uploading,
        uploadProgress,
        handleImageUpload,
        handleRemoveImage,
        renderImagePreviews
    } = useImageUpload(context);

    // State for form errors
    const [errors, setErrors] = useState({});

    useEffect(() => {
    // Fetch user profile data from API
        fetchDataFromApi(`/api/v1/user/${id}`).then((res) =>{
            console.log('User profile data:', res.data);
            const contactChecker = checkEmailOrPhone(res.data.contact);

            setProfile({    
                firstName: res.data.firstName ? res.data.firstName : res.data.name,
                lastName: res.data.lastName ? res.data.lastName : '',
                email: contactChecker === 'email' ? res.data.contact : res.data.email,
                phone: contactChecker === 'phone' ? res.data.contact : res.data.phone,
                role: res.data.role,
                status: res.data.status,
                avatar: res.data.avatar
            });
        }).catch((error) => {
            console.error('Error fetching user profile:', error);
        });
    }, []);

    //clear unsaved user profile images from the database and cloudinary upon refresh
    useEffect(() => {
        fetchDataFromApi('/api/v1/image').then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/v1/image/delete/cloudinary?img=${img}`).then((res => {
                        deleteDataFromApi('/api/v1/image/delete/all');
                    }));
                })
            })
        });
    }, []);

    // Checks if the given data is an email, phone number, or neither
    const checkEmailOrPhone = (data) => {
        if (!data || typeof data !== 'string') {
            return 'unknown';
        }

        // Trim whitespace from the input
        const input = data.trim();
        
        // Email regex 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Phone regex 
        const phoneRegex = /^\+?[\d\s\-()]{8,}$/;
        
        // Check if it's an email
        if (emailRegex.test(input)) {
            return 'email';
        }
        
        // Remove all non-digit characters for phone validation
        const digitsOnly = input.replace(/[^\d]/g, '');
        
        // Check if it's a phone number (between 8-15 digits)
        if (phoneRegex.test(input) && digitsOnly.length >= 8 && digitsOnly.length <= 15) {
            return 'phone';
        }
        
        return 'unknown';
    }


    /**
     * Handles changes to the profile form fields
     * @param {Event} e - The change event
     */
    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        if (name === "role") {
            handleRoleUpdate(value);
        }
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleUpdate = async (value) => {
        const response = await updateDataToApi(`/api/v1/user/role-update/${id}`, {role: value});
        console.log("---",response)

        if (!response.success) {
            context.showNotification(`${response.message}`, 'error');
        } else {
            context.showNotification('Profile updated successfully!', 'success');
        }
    }


    // Handle password change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!profile.firstName) newErrors.firstName = 'First name is required';
        if (!profile.lastName) newErrors.lastName = 'Last name is required';
        if (!profile.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle basic info submit
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            
            if (previews.length > 0) { profile.avatar = previews[0]; }
            // Submit profile data to API
            const response = await updateDataToApi(`/api/v1/user/${id}`, profile);
            // Handle response
            if (!response.success) {
                context.showNotification('Failed to update profile', 'error');
            } else {
                context.showNotification('Profile updated successfully!', 'success');
            }
        }
    };

    // Handle password submit
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        
        if (!passwords.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!passwords.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwords.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            // Submit logic here
            const response = await updateDataToApi('/api/v1/auth/updatepassword', passwords);
            // Handle response
            if (!response.success) {
                context.showNotification('Failed to update password', 'error');
            } else {
                context.showNotification('Password updated successfully!', 'success');
            }
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="dashboard-section profile-page">
                    <div className="header">
                        <h1>User Profile</h1>
                    </div>
                    
                    <div className="profile-card">
                        <div className="card-header">
                            <h2>Basic Information</h2>
                        </div>
                        
                        <div className="avatar-section">
                            {
                                previews.length > 0 ? (<img src={previews[0]} alt="Profile Avatar" className="avatar" />) : (
                                    <img src={profile.avatar} alt="Profile Avatar" className="avatar" />
                                )
                            }
                            
                            <div className="avatar-actions">
                                <label htmlFor="avatar-upload" className="btn btn-secondary">
                                    Change Photo
                                    {/* <input 
                                        id="avatar-upload" 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    /> */}
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, '/api/v1/image/upload', uploadImage, fetchDataFromApi, deleteImages)}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                <button className="btn btn-secondary" onClick={() => handleRemoveImage(previews[0], deleteImages)}>Remove</button>
                            </div>
                        </div>
                        
                        <form onSubmit={handleProfileSubmit}>
                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name</label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            name="firstName"
                                            value={profile.firstName}
                                            onChange={handleProfileChange}
                                        />
                                        {errors.firstName && <span className="error">{errors.firstName}</span>}
                                    </div>
                                </div>
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input 
                                            type="text" 
                                            id="lastName" 
                                            name="lastName"
                                            value={profile.lastName}
                                            onChange={handleProfileChange}
                                        />
                                        {errors.lastName && <span className="error">{errors.lastName}</span>}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email"
                                            value={profile.email}
                                            onChange={handleProfileChange}
                                        />
                                        {errors.email && <span className="error">{errors.email}</span>}
                                    </div>
                                </div>
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleProfileChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="role">Role <span style={{textTransform: "capitalize", fontWeight: "bold"}}>({profile?.role})</span></label>
                                        <select 
                                            id="role" 
                                            name="role"
                                            value={profile.role || "buyer"}
                                            onChange={handleProfileChange}
                                        >
                                            <option value="buyer">Buyer</option>
                                            <option value="seller">Seller</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="status">Status <span style={{textTransform: "capitalize", fontWeight: "bold"}}>({profile?.status})</span></label>
                                        <select 
                                            id="status" 
                                            name="status"
                                            value={profile.status}
                                            onChange={handleProfileChange}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="action-buttons">
                                <button type="button" className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="profile-card">
                        <div className="card-header">
                            <h2>Security</h2>
                        </div>
                        
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <input 
                                            type="password" 
                                            id="currentPassword" 
                                            name="currentPassword"
                                            value={passwords.currentPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        {errors.currentPassword && <span className="error">{errors.currentPassword}</span>}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input 
                                            type="password" 
                                            id="newPassword" 
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        {errors.newPassword && <span className="error">{errors.newPassword}</span>}
                                    </div>
                                </div>
                                <div className="form-col">
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input 
                                            type="password" 
                                            id="confirmPassword" 
                                            name="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="action-buttons">
                                <button type="submit" className="btn btn-primary">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;