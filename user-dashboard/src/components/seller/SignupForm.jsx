import React, { useState } from "react";
import "./style.css";

const SellerSignupForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        businessName: "",
        businessType: "",
    });

    const [errors, setErrors] = useState({});

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate Form
    const validate = () => {
        let errors = {};
        if (!formData.name.trim()) errors.name = "Full name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (!formData.password.trim()) errors.password = "Password is required";
        if (!formData.phone.trim()) errors.phone = "Phone number is required";
        if (!formData.businessName.trim()) errors.businessName = "Business name is required";
        return errors;
    };

    // Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            console.log("Form Submitted", formData);
            // Send data to API here...
        }
    };

    return (
        <div className="signup-container">
            <h2>Join AgriKonnect</h2>
            <p>Sell your agricultural products with ease!</p>
            <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>

                {/* Password */}
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>

                {/* Phone Number */}
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <span className="error">{errors.phone}</span>}
                </div>

                {/* Business Name */}
                <div className="form-group">
                    <label>Business Name</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} />
                    {errors.businessName && <span className="error">{errors.businessName}</span>}
                </div>

                {/* Business Type */}
                <div className="form-group">
                    <label>Business Type</label>
                    <select name="businessType" value={formData.businessType} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Farmer">Farmer</option>
                        <option value="Wholesaler">Wholesaler</option>
                        <option value="Retailer">Retailer</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SellerSignupForm;
