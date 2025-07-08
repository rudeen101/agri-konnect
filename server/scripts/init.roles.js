import User from '../models/User';
import { ROLES } from '../utils/permissions';

const initializeRoles = async () => {
  try {
    // Create super admin if not exists
    const superAdminExists = await User.findOne({ roles: 'super_admin' });
    
    if (!superAdminExists) {
      const superAdmin = new User({
        name: 'System Super Admin',
        email: 'superadmin@example.com',
        password: 'ChangeMe123!',
        roles: ['super_admin'],
        isVerified: true
      });
      
      await superAdmin.save();
      console.log('Super admin user created');
    }

    // Create sample admin
    const adminExists = await User.findOne({ roles: 'admin' });
    
    if (!adminExists) {
      const admin = new User({
        name: 'Platform Admin',
        email: 'admin@example.com',
        password: 'ChangeMe123!',
        roles: ['admin'],
        isVerified: true
      });
      
      await admin.save();
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error initializing roles:', error);
    process.exit(1);
  }
};

initializeRoles().then(() => process.exit());