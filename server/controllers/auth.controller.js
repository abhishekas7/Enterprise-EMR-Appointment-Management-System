import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service.js";

// Cookie options – shared across set / clear calls
const refreshTokenCookieOptions = {
    httpOnly: true,          // Not accessible via JS — prevents XSS theft
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",      // Prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
            data: {},
            meta: {},
        });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
            data: {},
            meta: {},
        });
    }

    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );

    // Persist refresh token in the database
    await authService.saveRefreshToken(user._id, refreshToken);

    // Store refresh token in HttpOnly cookie — never exposed to client JS
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        },
        meta: {},
    });
};

export const refreshToken = async (req, res) => {
    try {
        // Read refresh token from HttpOnly cookie — not from Authorization header
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required",
                data: {},
                meta: {},
            });
        }

        const accessToken = await authService.refreshAccessToken(token);

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: { accessToken },
            meta: {},
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
            data: {},
            meta: {},
        });
    }
};

export const logout = async (req, res) => {
    // Read the token from the HttpOnly cookie — client doesn't need to send it
    const token = req.cookies?.refreshToken;

    if (token) {
        // Delete from database to invalidate the token server-side
        await authService.logout(token);
    }

    // Clear the cookie regardless of whether a token was found
    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    return res.status(200).json({
        success: true,
        message: "Logout successful",
        data: {},
        meta: {},
    });
};

export const profile = async (req, res) => {
    res.json({
        success: true,
        message: "Profile API",
        data: {},
        meta: {},
    });
};