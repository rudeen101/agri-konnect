// controllers/authController.js
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import sendEmail from '../utils/sendEmail.js';


/**
 * @desc Verify token and return user data
 */                                             
export const authVerification = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedUser) return res.status(401).json({success: false, message: "Invalid token" });

        const user = await User.findById(verifiedUser.id);

        res.json({ username: user.name, contact: user.contact, userId: user._id, role: user.role });

    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */                             
export const register = async (req, res) => {
    try {
        // Destructure request body with all possible fields
        const {
            name,
            contact,
            password,
            role = 'buyer',
            businessName,
            businessAddress,
            businessCity,
            businessCounty,
            businessDescription,
            // businessLicense,
            // employeeId,
            // department
        } = req.body;

        console.log(req.body)

        // Validate required fields
        if (!name || !contact || !password) {
            return res.status(400).json({ 
                error: 'Name, email or phone number, and password are required' 
            });
        }

        // Check if user already exists by email
        const existingUser = await User.findOne({ contact });
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User already exists with this email or phone number' 
            });
        }

        // Prepare user data object
        const userData = {
            name,
            contact,
            password,
            role
        };

        // Add role-specific data
        if (role === 'seller') {
            if (!sellerProfile.businessName || !sellerProfile.businessAddress || !sellerProfile.businessCity || !sellerProfile.businessCounty || !sellerProfile.businessDescription) {
                return res.status(400).json({ 
                    error: 'Business name, address, city, county, and desscription, are required for sellers' 
                });
            }
            userData.sellerProfile = {
                businessName,
                businessAddress,
                businessCity,
                businessCounty,
                businessDescription,
                isApproved: false // Default to false for new sellers
            };
        } else if (role === 'agent') {
            if (!employeeId) {
                return res.status(400).json({ 
                    error: 'Employee ID is required for agents' 
                });
            }
            userData.agentProfile = {
                employeeId,
                department,
                isActive: true // Default to true for new agents
            };
        }

        // Create new user (password hashing handled by pre-save middleware)
        const user = await User.create(userData);

        // Generate tokens
        const accessToken = user.getSignedJwtToken();
        const refreshToken = user.getRefreshToken();

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.COOKIE_DOMAIN || 'localhost',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        // Prepare response data
        const responseData = {
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar
            }
        };

        // Include role-specific data in response if applicable
        if (role === 'seller') {
            responseData.user.sellerProfile = user.sellerProfile;
        } else if (role === 'agent') {
            responseData.user.agentProfile = user.agentProfile;
        }

        res.status(201).json(responseData);

    } catch (error) {
        console.error('Registration Error:', error);
        
        // Handle duplicate key errors (e.g., duplicate email)
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: 'User with this email already exists' 
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                error: 'Validation Error',
                details: errors 
            });
        }

        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message 
        });
    }
};
/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 */ 
export const login = async (req, res) => {

    try {
        const { contact, password } = req.body;
        const user = await User.findOne({ contact }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = user.getSignedJwtToken();
        const refreshToken = user.getRefreshToken();

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.COOKIE_DOMAIN || 'localhost',
            path: '/'
        };

        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(201).json({
            message: 'User login successfully',
            user: {
            id: user._id,
            name: user.name,
            contact: user.contact,
            role: user.role,
            permissions: user.permissions
            }
        });
            

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
};

export const forgotPassword = async (req, res) => {
    const user = await User.findOne({ contact: req.body.contact });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail(user.contact, 'Password Reset', `Reset here: ${resetUrl}`);
    res.json({ message: 'Reset email sent' });
};

export const resetPassword = async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
};

export const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
};

// Refresh Token Route
// router.get("/refresh", async (req, res) => {
// export const refresh = async (req, res) => {
//     try {
//         const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

//         if (!refreshToken) {
//             return res.status(401).json({ error: "Unauthorized. No refresh token." });
//         }

//         const user = await User.findOne({ refreshToken });
//         if (!user) return res.status(401).json({ error: "Invalid refresh token" });

//         function getTokenExpiration(token) {
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             const expiration = new Date(payload.exp * 1000);
//             const now = new Date();
//             return {
//               expiresAt: expiration,
//               secondsRemaining: Math.floor((expiration - now) / 1000)
//             };
//           }
        
//         // Verify Refresh Token
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({ error: "Invalid or expired refresh token." });
//             }

//             // Generate new access token
//             const newAccessToken = generateAccessToken(user);

//             res.cookie("accessToken", newAccessToken, {
//                 httpOnly: true,  
//                 secure: process.env.NODE_ENV === "production" ? true : false, //Secure must be true in production
//                 sameSite: "lax", //Required for cross-origin cookies
//                 domain: "localhost", // Ensures the cookie is scoped correctly
//                 path: '/', // Accessible across all paths
    
//             });

//             // Send the new access token
//             res.json({ accessToken: newAccessToken });
//         });

//     } catch (error) {
//         console.error("Refresh token error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

export const updateDetails = async (req, res) => {
    const fields = { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, phone: req.body.phone, avatar: req.body.avatar };
    const user = await User.findByIdAndUpdate(req.user.id, fields, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // Remove sensitive fields before sending response

    res.json({ success: true});
};


export const updatePassword = async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
};

// Logout (Invalidate Refresh Token)
export const logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.json({ success: true, message: "Logged out successfully" });
};

export const impersonateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const token = user.getSignedJwtToken();
    res.json({ success: true, token, message: `Now impersonating ${user.name}` });
};


// Handle callback
export const googleCallbackHandler = async (req, res) => {
  const accessToken = req.user.getSignedJwtToken();
  const refreshToken = req.user.getRefreshToken();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  // Redirect or respond
  res.redirect(`${process.env.FRONTEND_URL}/`); // or return JSON
};
