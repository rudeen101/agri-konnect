// import passport from 'passport';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';
// import User from '../models/User.model.js';
// import logger from '../utils/logger.js';
// import { 
//     JWT_SECRET, 
//     GOOGLE_CLIENT_ID, 
//     GOOGLE_CLIENT_SECRET,
//     // GITHUB_CLIENT_ID,
//     // GITHUB_CLIENT_SECRET 
// } from './environment.js';
// import { handleOAuthLogin } from '../utils/handleOAuthLogin.js';


// // JWT Strategy Configuration
// const jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromExtractors([
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//         (req) => req.cookies?.token
//     ]),
//     secretOrKey: JWT_SECRET,
//     issuer: process.env.JWT_ISSUER || 'your-app-name',
//     audience: process.env.JWT_AUDIENCE || 'your-app-client',
//     passReqToCallback: true
// };

// passport.use(new JwtStrategy(jwtOptions, async (req, payload, done) => {
//     try {
//         const user = await User.findById(payload.id)
//             .populate('role')
//             .select('-password');

//         if (!user || !user.isActive) {
//             return done(null, false);
//         }

//         // Attach additional request context
//         req.authInfo = {
//             scope: payload.scope,
//             authTime: payload.auth_time
//         };

//         return done(null, user);
//     } catch (err) {
//         logger.error(`JWT Strategy Error: ${err.message}`);
//         return done(err, false);
//     }
// }));

// // Local Strategy (Email/Password)
// passport.use(new LocalStrategy(
//     {
//         usernameField: 'email',
//         passwordField: 'password',
//         session: false,
//         passReqToCallback: true
//     },
//     async (req, email, password, done) => {
//         try {
//             const user = await User.findOne({ email }).select('+password');
            
//             if (!user || !(await user.matchPassword(password))) {
//                 return done(null, false, { message: 'Invalid credentials' });
//             }

//             if (!user.isActive) {
//                 return done(null, false, { message: 'Account deactivated' });
//             }

//             return done(null, user);
//         } catch (err) {
//             return done(err);
//         }
//     }
// ));

// // Google OAuth Strategy
// passport.use(new GoogleStrategy(
//     {
//         clientID: GOOGLE_CLIENT_ID,
//         clientSecret: GOOGLE_CLIENT_SECRET,
//         callbackURL: '/api/v1/auth/google/callback',
//         passReqToCallback: true,
//         scope: ['profile', 'email'],
//         state: true
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//         try {
//             // Custom profile handling
//             const transformedProfile = {
//                 provider: 'google',
//                 providerId: profile.id,
//                 email: profile.emails[0].value,
//                 name: profile.displayName,
//                 avatar: profile.photos[0]?.value
//             };

//             const user = await handleOAuthLogin(transformedProfile);
//             return done(null, user);
//         } catch (err) {
//             return done(err);
//         }
//     }
// ));

import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';


import User from '../models/User.model.js';
import logger from '../utils/logger.js';
import { 
    JWT_SECRET, 
    GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET,
    // GITHUB_CLIENT_ID,
    // GITHUB_CLIENT_SECRET
} from './environment.js';
import { handleOAuthLogin } from '../utils/handleOAuthLogin.js';


// JWT Strategy Configuration
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.cookies?.token
    ]),
    secretOrKey: JWT_SECRET,
    issuer: process.env.JWT_ISSUER || 'your-app-name',
    audience: process.env.JWT_AUDIENCE || 'your-app-client',
    passReqToCallback: true
};

passport.use(new JwtStrategy(jwtOptions, async (req, payload, done) => {
    try {
        const user = await User.findById(payload.id)
            .populate('role')
            .select('-password');

        if (!user || !user.isActive) {
            return done(null, false);
        }

        req.authInfo = {
            scope: payload.scope,
            authTime: payload.auth_time
        };

        return done(null, user);
    } catch (err) {
        logger.error(`JWT Strategy Error: ${err.message}`);
        return done(err, false);
    }
}));

// Local Strategy (Email/Password)
// passport.use(new LocalStrategy(
//     {
//         usernameField: 'email',
//         passwordField: 'password',
//         session: false,
//         passReqToCallback: true
//     },
//     async (req, email, password, done) => {
//         try {
//             const user = await User.findOne({ email }).select('+password');
            
//             if (!user || !(await user.matchPassword(password))) {
//                 return done(null, false, { message: 'Invalid credentials' });
//             }

//             if (!user.isActive) {
//                 return done(null, false, { message: 'Account deactivated' });
//             }

//             return done(null, user);
//         } catch (err) {
//             return done(err);
//         }
//     }
// ));

// Google OAuth Strategy
passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/callback',
        passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            const transformedProfile = {
                provider: 'google',
                providerId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                avatar: profile.photos[0]?.value
            };

            const user = await handleOAuthLogin(transformedProfile);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// GitHub Strategy Configuration
// passport.use(new GitHubStrategy(
//     {
//         clientID: GITHUB_CLIENT_ID,
//         clientSecret: GITHUB_CLIENT_SECRET,
//         callbackURL: '/api/v1/auth/github/callback',
//         passReqToCallback: true,
//         scope: ['user:email']
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//         // Similar handling as Google
//     }
// ));

// Serialization for session support
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});



export default passport;