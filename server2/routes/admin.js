// routes/adminAccounts.js
import express from "express"
import bcrypt from "bcryptjs"
import User from '../models/users.js'
import jwt from "jsonwebtoken"
import { verifyToken, authorize } from "../middleware/auth.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwtHelper.js"



const router = express.Router();

/**
 * GET /api/admin/accounts
 * List all admin accounts.
 */
router.get('/users', verifyToken, authorize(["superAdmin", "admin"]), async (req, res) => {
  try {
    // Find all users with role 'admin'
    const allUsers = await User.find({ deleted: false }).select('-password').lean();
    res.json({ allUsers });
  } catch (err) {
    console.error("Error fetching usser accounts:", err);
    res.status(500).json({ error: 'Failed to fetch user accounts' });
  }
});

/**
 * List all deleted users.
 */
router.get('/users/deleted', verifyToken, authorize(["superAdmin", "admin"]), async (req, res) => {
  try {
    // Find all users with role 'admin'
    const deletedUsers = await User.find({ deleted: true }).select('-password').lean();
    res.json({ deletedUsers });
  } catch (err) {
    console.error("Error fetching usser accounts:", err);
    res.status(500).json({ error: 'Failed to fetch user accounts' });
  }
});

// Admin Sign-in Route
router.post("/signin", async (req, res) => {
    try {
        const { contact, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ contact });
        if (!user) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check if the user has an admin role
        if (!user.roles.includes("admin")) {
            return res.status(403).json({ message: "Access denied. Not an admin." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

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
	
		res.json({ message: 'Logged in successfully', user: { username: user.name, contact: user.contact, userId: user._id }});

    } catch (error) {
		console.log(error)
        res.status(500).json({ message: error.message });
    }
});

// Update User Roles (Admins Only)
router.put("/updateRole/:userId", verifyToken, authorize(["superAdmin"]), async (req, res) => {
    const { role } = req.body;
    const { userId } = req.params;

    if (!Array.isArray(role)) {
        return res.status(400).json({ message: "Invalid roles format" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent unauthorized role update attempts
        if (!req.user.roles.includes("superAdmin")) {
            console.warn(`Unauthorized attempt by ${req.user.id} to assign role.`);
            return res.status(403).json({ message: "Unauthorized to assign role" });
        }



        user.approveRoleUpdate(); // Mark as admin-approved

        // Add role to array only if it doesn’t already exist
        await User.findByIdAndUpdate(userId, { 
            $addToSet: { roles: role }  // Ensures no duplicates
        });
        // await user.save();

        res.json({ message: "Roles updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * REMOVE /removeRole/:userId
 * remove an USER role.
 */
router.put("/removeRole/:userId", verifyToken, authorize(["superAdmin"]), async (req, res) => {
    try {
        const {roleToRemove} = req.body;
        const userId = req.params.userId;
        // const updateUserId = req.params.updateUserId;
		
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent unauthorized users from removing "admin" role
        if (!req.user.roles.includes("superAdmin")) {
            return res.status(403).json({ message: "Unauthorized to remove 'admin' role" });
        }

        // Prevent unauthorized role escalation
        user.approveRoleUpdate(); // Mark as admin-approved

		const updateUser = await User.findById(userId);
        if (!updateUser) return res.status(404).json({ message: "User does not exist!" });

        await User.findByIdAndUpdate(userId, { 
            $pull: { roles: roleToRemove }  // Removes only the specified role
        });

        res.status(200).json({ message: `Role '${roleToRemove}' removed successfully.` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
