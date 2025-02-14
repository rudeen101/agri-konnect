// routes/adminAccounts.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require("jsonwebtoken");
const { verifyToken, authorize } = require('../middleware/auth');
const { generateAccessToken, generateRefreshToken } = require("../utils/jwtHelper");



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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		

		user.refreshToken = refreshToken;
		await user.save();
	
		res.json({ message: 'Logged in successfully', accessToken, refreshToken, user: { username: user.name, contact: user.contact, userId: user._id } });

    } catch (error) {
		console.log(error)
        res.status(500).json({ message: error.message });
    }
});

/**
 * POST /api/admin/accounts
 * Create a new admin account.
 */
// router.post('/add/:userId', verifyToken, authorize('superAdmin'), async (req, res) => {
//   const { userId, role} = req.body;
//   if (!userId || !role) {
//     return res.status(400).json({ error: 'Provide user and role' });
//   }
//   try {
//     // Check if a user with the same username already exists
//     const existing = await User.findOne({ contact });
//     if (existing) {
//       return res.status(400).json({ error: 'User already exists; update user role.' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Create a new user with role "admin"
//     const newUser = new User({ name, contact, password: hashedPassword, roles: [role] });
//     await newUser.save();
//     res.status(201).json({
//       message: 'Account created successfully',
//       admin: { name: newUser.name, role: newUser.role }
//     });
//   } catch (err) {
//     console.error("Error creating account:", err);
//     res.status(500).json({ error: 'Failed to create account' });
//   }
// });

/**
 * PUT /api/admin/accounts/:id
 * Update an existing admin account (username and/or password).
 */


// Update User Roles (Admins Only)
router.put("/updateRole/:userId", verifyToken, authorize(["superAdmin"]), async (req, res) => {
    const { role } = req.body;
    const { userId } = req.params;
    console.log(userId)

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
        console.log(roleToRemove)
		
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

module.exports = router;
