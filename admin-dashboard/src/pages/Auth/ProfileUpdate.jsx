import React, { useState, useEffect, useContext } from 'react';
import useImageUpload from '../../hooks/useImageUpload';
import { useAppContext } from '../../contexts/AppContext'; // Assuming you have a context
import { fetchDataFromApi, uploadImage, deleteImages, updateDataToApi, deleteDataFromApi, postDataToApi } from '../../utils/apiCalls';
import './Auth.css';
import { useParams, useNavigate } from "react-router-dom";


const ProfileUpdate = () => {
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
		fetchDataFromApi('/api/v1/auth/me').then((res) =>{
			console.log('User profile data:', res);
			const contactChecker = checkEmailOrPhone(res.contact);

			setProfile({
				firstName: res.firstName ? res.firstName : res.name,
				lastName: res.lastName ? res.lastName : '',
				email: contactChecker === 'email' ? res.contact : '',
				phone: contactChecker === 'phone' ? res.contact : '',
				role: res.role,
				status: res.status,
				avatar: res.avatar
			});
		}).catch((error) => {
			console.error('Error fetching user profile:', error);
		});
	}, []);

	//clear unsaved user profile images from the database and cloudinary upon refresh
    useEffect(() => {
        // Fetch user data from API
        fetchDataFromApi(`/api/v1/user/${id}`).then((res) =>{
            console.log('User data:', res.user.name);
            profile.firstName = res.user.name;
            // lastName: '',
            // email: '',
            // phone: '',
            // role: '',
            // status: '',
            // avatar: 'https://via.placeholder.com/80'
       
        }).catch((error) => {
            console.error('Error fetching user data:', error);
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
		setProfile(prev => ({
			...prev,
			[name]: value
		}));
	};

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
			const response = await updateDataToApi('/api/v1/auth/updatedetails', profile);
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
        } else if (passwords.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
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
                                <label htmlFor="role">Role</label>
                                <select 
                                    id="role" 
                                    name="role"
                                    value={profile.role}
                                    onChange={handleProfileChange}
                                >
                                    <option value="admin">Administrator</option>
                                    <option value="user">User</option>
                                    <option value="editor">Editor</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-col">
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
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
    );
};

export default ProfileUpdate;