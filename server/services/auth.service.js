import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const saveRefreshToken = async (userId, token) => {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000); // convert Unix timestamp to Date

    await RefreshToken.create({ userId, token, expiresAt });
};

export const logout = async (refreshToken) => {
    await RefreshToken.findOneAndDelete({
        token: refreshToken
    });
};

export const refreshAccessToken = async (refreshToken) => {
    // Check if refresh token exists in DB
    const savedToken = await RefreshToken.findOne({
        token: refreshToken,
    });

    if (!savedToken || savedToken.isRevoked) {
        throw new Error("Invalid refresh token");
    }

    // Verify refresh token signature
    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
        throw new Error("User not found or inactive");
    }

    // Generate new access token
    const accessToken = jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
    );

    return accessToken;
};