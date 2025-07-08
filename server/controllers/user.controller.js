// controllers/user.controller.js
import User from '../models/User.model.js';
import sendEmail from '../utils/sendEmail.js';

export const getUsers = async (req, res) => {
  res.status(200).json(res.advancedResults);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

// Update User Roles (super admin Only)
// router.put("/updateRole/:userId", verifyToken, authorize(["superAdmin"]), async (req, res) => {
export const updateUserRole = async (req, res) => {
	const { role } = req.body;
    const { id } = req.params;

    // if (!Array.isArray(roles)) {
    //     return res.status(400).json({ success: false, message: "Invalid roles format" });
    // }

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

            console.log(user)

        // Prevent unauthorized role update attempts
        if (user.role !== "superAdmin") {
            console.warn(`Unauthorized attempt by ${user.id} to assign role.`);
            return res.status(403).json({ success: false, message: "Unauthorized to assign role" });
        }

		// Prevent unauthorized role escalation
        user.approveRoleUpdate(); // 

        // Add role to array only if it doesn’t already exist
        await User.findByIdAndUpdate(id, { role: role });
        // await user.save();

        res.json({ success: true, message: "Roles updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * REMOVE /removeRole/:userId
 * remove an USER role.
 */
// router.put("/removeRole/:userId", verifyToken, authorize(["superAdmin"]), async (req, res) => {
export const removeUserRole = async (req, res) => {
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
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User deleted' });
};

export const userStats = async (req, res) => {
  const stats = await User.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  res.json({ success: true, data: stats });
};

export const bulkDeleteUsers = async (req, res) => {
  const { ids } = req.body;
  const result = await User.deleteMany({ _id: { $in: ids } });
  res.json({ message: `${result.deletedCount} users deleted` });
};

export const bulkInviteUsers = async (req, res) => {
  const { emails } = req.body;
  for (const email of emails) {
    const user = await User.create({ email, password: crypto.randomBytes(10).toString('hex') });
    const inviteUrl = `${process.env.FRONTEND_URL}/register?email=${encodeURIComponent(email)}`;
    await sendEmail(email, 'Invitation to Join', `Click to join: ${inviteUrl}`);
  }
  res.json({ success: true, message: 'Invitations sent' });
};
