import User from '../models/User.model.js';
import crypto from 'crypto';

export async function handleOAuthLogin({ provider, providerId, email, name, avatar }) {
  let user = await User.findOne({ 
    $or: [
      { [`social.${provider}.id`]: providerId }, 
      { email }
    ]
  });

  if (user) {
    if (!user.social[provider]?.id) {
      user.social[provider] = { id: providerId, avatar };
      await user.save();
    }
    return user;
  }

  user = new User({
    name,
    email,
    isVerified: true,
    social: {
      [provider]: { id: providerId, avatar }
    },
    password: crypto.randomBytes(16).toString('hex') // fake password
  });

  await user.save();
  return user;
}
