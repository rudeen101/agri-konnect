import express from 'express';
import {
  authenticate,
  requireRole,
  requirePermission
} from '../middleware/authMiddleware';
import { PERMISSIONS } from '../utils/permissions';
import User from '../models/User';

const router = express.Router();

// Admin dashboard stats
router.get('/dashboard',
  authenticate,
  requireRole('admin', 'super_admin'),
  requirePermission(PERMISSIONS.ADMIN.VIEW_REPORTS),
  async (req, res) => {
    // Get stats logic here
    res.json({ success: true, data: {} });
  }
);

// Manage users
router.get('/users',
  authenticate,
  requirePermission(PERMISSIONS.ADMIN.MANAGE_USERS),
  async (req, res) => {
    const users = await User.find();
    res.json({ success: true, data: users });
  }
);

// Assign roles (admin or super admin)
router.put('/users/:id/roles',
  authenticate,
  requirePermission(PERMISSIONS.SYSTEM.MANAGE_ROLES),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    
    // Prevent non-super-admins from assigning admin roles
    if (req.body.roles.includes('admin') && 
        !req.user.roles.includes('super_admin')) {
      return res.status(403).json({ 
        success: false, 
        error: 'Only super admins can assign admin roles' 
      });
    }

    user.roles = req.body.roles;
    await user.save();
    
    res.json({ success: true, data: user });
  }
);

export default router;


router.route('/')
    .get(
        advancedResults(User, 'users'),
        getUsers
    )
    .post(createUser);

router.route('/stats')
    .get(userStats);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    // .put(updateUserRoles)
    // .put(removeUserRole)
    .delete(deleteUser);