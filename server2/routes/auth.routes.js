import 'dotenv/config'; // Load .env variables
import express from "express"
const router = express.Router();
import bcrypt from "bcryptjs"
import User from '../models/users.js'
import Seller from '../models/seller.js'
import { verifyToken, authorize } from "../middlewares/auth.middleware.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwtHelper.js"
import jwt from "jsonwebtoken"


// Signup Route
router.post("/user/signup", async (req, res) => {
    try {
        const { name, contact, password, role } = req.body;
        if (!contact || !password) {
            return res.status(400).json({ error: 'Contact and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ contact });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(19);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, contact, hashedPassword, role: role || 'user' });
        const user = await newUser.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set Token as HTTP-Only Cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === "production" ? true : false, //Secure must be true in production
            sameSite: "lax", //Required for cross-origin cookies
            domain: "localhost", // Ensures the cookie is scoped correctly
            path: '/', // Accessible across all paths

        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === "production" ? true : false, //Secure must be true in production
            sameSite: "lax", //Required for cross-origin cookies
            domain: "localhost", // Ensures the cookie is scoped correctly
            path: '/', // Accessible across all paths

        });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Login Endpoint: Issues JWT token on successful login
router.post('/user/signin', async (req, res) => {
    const { contact, password } = req.body;
    
    try {
		const user = await User.findOne({ contact });
		if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
		if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
		
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		user.refreshToken = refreshToken;
		await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === "production" ? true : false, //Secure must be true in production
            sameSite: "lax", //Required for cross-origin cookies
            domain: "localhost", // Ensures the cookie is scoped correctly
            path: '/', // Accessible across all paths

        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === "production" ? true : false, //Secure must be true in production
            sameSite: "lax", //Required for cross-origin cookies
            domain: "localhost", // Ensures the cookie is scoped correctly
            path: '/', // Accessible across all paths

        });
		
		res.json({ message: 'Logged in successfully', user: { username: user.name, contact: user.contact, userId: user._id } });
    } catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Login failed' });
    }
});

// Verify token and return user data
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedUser) return res.status(401).json({ message: "Invalid token" });

        const user = await User.findById(verifiedUser.id);

        res.json({ username: user.name, contact: user.contact, userId: user._id });

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// Check whether user is a seller
router.get("/seller", verifyToken, async (req, res) => {
    try {

        const seller = await User.findOne({user: req.user.id});

        if (!seller) return res.status(400).json({ error: 'Not a Seller' });

        res.json({ success: true});

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Invalid token" });
    }
});

// Refresh Token Route
router.get("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

        if (!refreshToken) {
            return res.status(401).json({ error: "Unauthorized. No refresh token." });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(401).json({ error: "Invalid refresh token" });

        function getTokenExpiration(token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiration = new Date(payload.exp * 1000);
            const now = new Date();
            return {
              expiresAt: expiration,
              secondsRemaining: Math.floor((expiration - now) / 1000)
            };
          }
        
        // Verify Refresh Token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid or expired refresh token." });
            }

            // Generate new access token
            const newAccessToken = generateAccessToken(user);

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,  
                secure: process.env.NODE_ENV === "production" ? true : false, //Secure must be true in production
                sameSite: "lax", //Required for cross-origin cookies
                domain: "localhost", // Ensures the cookie is scoped correctly
                path: '/', // Accessible across all paths
    
            });

            // Send the new access token
            res.json({ accessToken: newAccessToken });
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Logout (Invalidate Refresh Token)
router.post("/logout", verifyToken, async (req, res) => {

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("user");
	await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

	res.json({ message: "Logged out successfully" });
});

// Soft delete a user (Admins only)
router.delete("/user/delete/:id", verifyToken, authorize(["admin"]), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.deleted = true;
        user.deletedAt = new Date();
        await user.save();

        res.json({ message: "User account deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/user/restore/:id", verifyToken, authorize(["admin"]), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.deleted = false;
        user.deletedAt = null;
        await user.save();

        res.json({ message: "User account restored successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
