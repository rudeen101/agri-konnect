import express from 'express';
import {
    authVerification,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    getMe,
    updateDetails,
    updatePassword,
    impersonateUser,
    googleCallbackHandler
} from '../controllers/auth.controller.js';
import passport from 'passport';
import { authenticate} from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resettoken', resetPassword);
router.get('/verification', authVerification);

// // Protected routes (require authentication)
router.get('/me', authenticate, getMe);
router.put('/updatedetails', authenticate, updateDetails);
router.put('/updatepassword', authenticate, updatePassword);
router.get('/logout', authenticate, logout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], state: true }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallbackHandler);

// // Admin-only routes
// router.post('/impersonate/:id', authenticate, authorize('admin'), impersonateUser);

export default router;