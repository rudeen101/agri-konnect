// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const { verifyToken, authorize } = require('../middleware/auth');
const { generateAccessToken, generateRefreshToken } = require("../utils/jwtHelper");
const jwt = require("jsonwebtoken");



// router.post('/signup', async (req, res) => {
//     const {name, email, phone, password, isAdmin} = req.body;
//     console.log(req.body);

//     try{
//         const existingUserByEmail = await User.findOne({"email": email});
//         const existingUserByPhone = await User.findOne({"phone": phone});

//         if (existingUserByEmail || existingUserByPhone) {
//             res.status(400).json({error: true, msg: "user already exist!"});
//         }
//         else {
//             const hashPassword = await bcrypt.hash(password, 20);
//             const result = await User.create({
//                 name: name,
//                 email: email,
//                 phone: phone,
//                 password: hashPassword,
//                 isAdmin:  isAdmin
//             });

//             const token = jwt.sign({
//                 email: result.email,
//                 id: result.id
//             }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

//             res.status(200).json({
//                 user: result,
//                 token: token
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({error: "ture", msg: "Something went wrong"});
//     }
// });

// Registration Endpoint

router.post('/signup', async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || 'buyer' });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// router.post('/signin', async (req, res) => {
//     const {email, password} = req.body;

//     try{
//         const existingUser = await User.findOne({"email": email});
 
//         if (!existingUser) {
//             res.status(404).json({error: true, msg: "user not found"});
//         } else{
//             const matchPassword = await bcrypt.compare(password, existingUser.password);

//             if (!matchPassword) {
//                 return res.status(400).json({error: true, msg: "password wrong"});
//             }
    
//             const token = jwt.sign({
//                 email: existingUser.email,
//                 id: existingUser.id
//             }, process.env.JSON_WEB_TOKEN_SECRET_KEY); 
    
//             return res.status(200).send({
//                 user: existingUser,
//                 token: token,
//                 msg: "user login successfully!"
//             });
//         }



//         // else {
//         //     const hashPassword = await bcrypt.hash(password, 20);
//         //     const result = await User.create({
//         //         name: name,
//         //         email: email,
//         //         password: hashPassword,
//         //         isAdmin: isAdmin
//         //     });

//             // const token = jwt.sign({
//             //     email: result.email,
//             //     id: result.id
//             // }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

//             // res.status(200).json({
//             //     user: result,
//             //     token: token
//             // })
//         // }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({error: "ture", msg: "Something went wrong"});
//     }
// });

// Logout Endpoint

// Login Endpoint: Issues JWT token on successful login
router.post('/signin', async (req, res) => {
    const { contact, password } = req.body;
    try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ error: 'Invalid credentials' });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
		
		// Create JWT payload
		// const payload = { userId: user._id, role: user.role };
		// Sign token with expiration (e.g., 1 day)
		// const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		user.token = refreshToken;
		await user.save();

		// res.json({ accessToken, refreshToken });
		
		res.json({ message: 'Logged in successfully', accessToken, refreshToken, user: { username: user.name, contact: user.contact, userId: user._id } });
    } catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Login failed' });
    }
});

// Token Refresh
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ error: "Unauthorized: No refresh token" });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ error: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid refresh token" });

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
});
// Logout (Invalidate Refresh Token)
router.post("/logout", async (req, res) => {
	const { userId } = req.body;

	await User.findByIdAndUpdate(userId, { refreshToken: null });

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

module.exports = router;
