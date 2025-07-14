import express from 'express';
import {
    getUsers,
    getUser,
    // createUser,
    updateUser,
    // deleteUser,
    // userStats,
    updateUserRole,
    // removeUserRole
} from '../controllers/user.controller.js';
// import { protect, authorize } from '../middlewares/auth.middleware.js';
import advancedResults from '../middlewares/orderAdvancedResults.middleware.js';
import User from '../models/User.model.js';

const router = express.Router();

// Admin privileges required for all routes
// router.use(protect);
// router.use(authorize('admin'));

router.route('/')
    .get(
        advancedResults(User, 'users'),
        getUsers
    )
    // .post(createUser);

// router.route('/stats')
//     .get(userStats);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    // .put(updateUserRole)
    // .put(removeUserRole)
    // .delete(deleteUser);

router.put('/role-update/:id', updateUserRole);


// Bulk operations
// router.post('/bulk-delete', bulkDeleteUsers);
// router.post('/bulk-invite', bulkInviteUsers);

export default router;