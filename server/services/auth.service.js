import User from '../models/User.model.js';
import ErrorResponse from '../utils/errorResponse.js';
import { generateToken, verifyToken } from '../utils/tokenUtils.js';
import AuditLog from '../models/AuditLog.model.js';
import { sendEmail } from './email.service.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.js';

class AuthService {
    // User registration with email verification
    async register(userData) {
        // Check for existing user
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new ErrorResponse('Email already in use', 400);
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create user
        const user = await User.create({
            ...userData,
            verificationToken,
            verificationExpire
        });

        // Send verification email
        await sendEmail({
            email: user.email,
            subject: 'Account Verification',
            template: 'verify-email',
            context: {
                name: user.name,
                verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
            }
        });

        // Log registration
        await AuditLog.create({
            action: 'register',
            entity: 'User',
            entityId: user._id,
            metadata: {
                provider: 'email',
                ip: userData.ip
            }
        });

        return user;
    }

    // Login with rate limiting
    async login(email, password, ip) {
        await loginRateLimiter.consume(ip); // Rate limiting

        const user = await User.findOne({ email }).select('+password +loginAttempts');
        if (!user || !(await user.matchPassword(password))) {
            await this.handleFailedLogin(user, ip);
            throw new ErrorResponse('Invalid credentials', 401);
        }

        if (!user.isVerified) {
            throw new ErrorResponse('Please verify your email first', 403);
        }

        if (!user.isActive) {
            throw new ErrorResponse('Account is disabled', 403);
        }

        // Reset login attempts on success
        user.loginAttempts = 0;
        await user.save();

        // Generate tokens
        const token = user.getSignedJwtToken();
        const refreshToken = user.getRefreshToken();

        // Log successful login
        await AuditLog.create({
            action: 'login',
            entity: 'User',
            entityId: user._id,
            metadata: {
                provider: 'email',
                ip
            }
        });

        return { user, token, refreshToken };
    }

    // Password reset flow
    async requestPasswordReset(email) {
        const user = await User.findOne({ email });
        if (!user) return; // Don't reveal if user exists

        // Create reset token (1 hour expiry)
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
        await user.save();

        // Send reset email
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            template: 'reset-password',
            context: {
                name: user.name,
                resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
            }
        });

        return resetToken;
    }

    // Handle failed login attempts
    async handleFailedLogin(user, ip) {
        if (!user) return;

        user.loginAttempts += 1;
        if (user.loginAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
            user.isActive = false;
            await sendEmail({
                email: user.email,
                subject: 'Account Locked',
                template: 'account-locked'
            });
        }
        await user.save();

        await AuditLog.create({
            action: 'login_failed',
            entity: 'User',
            entityId: user._id,
            metadata: { ip }
        });
    }

    // Social login unification
    async handleSocialLogin(profile) {
        // Find or create user based on provider
        let user = await User.findOne({
            $or: [
                { email: profile.email },
                { [`social.${profile.provider}.id`]: profile.providerId }
            ]
        });

        if (!user) {
            // Create new user from social profile
            user = await User.create({
                name: profile.name,
                email: profile.email,
                isVerified: true,
                social: {
                    [profile.provider]: {
                        id: profile.providerId,
                        avatar: profile.avatar
                    }
                }
            });
        } else {
            // Update existing user's social profile
            user.social[profile.provider] = {
                id: profile.providerId,
                avatar: profile.avatar
            };
            await user.save();
        }

        return user;
    }
}

export default new AuthService();