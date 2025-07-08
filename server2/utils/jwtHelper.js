import jwt from "jsonwebtoken";
import 'dotenv/config'; // Load .env variables


const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, roles: user.roles },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRES_IN }
    );
};

export { generateAccessToken, generateRefreshToken };
