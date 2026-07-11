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

// ---------------------------------------------------------------------------
// POST /api/v1/auth/login
// Input is pre-validated by validateLoginInput middleware (400/422).
// Returns 401 for wrong credentials, 500 for unexpected server errors.
// ---------------------------------------------------------------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // Use the same generic message for "not found" and "wrong password"
        // to prevent user enumeration attacks.
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
                data: {},
                meta: {},
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
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
            message: "Login successful.",
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
    } catch (error) {
        // Log the real error internally; never expose internal details to the client
        console.error("[login] Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
            data: {},
            meta: {},
        });
    }
};

// ---------------------------------------------------------------------------
// POST /api/v1/auth/refresh
// Requires the HttpOnly refreshToken cookie.
// Returns 401 for missing token, 403 for invalid/expired, 500 for unexpected.
// ---------------------------------------------------------------------------
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required.",
                data: {},
                meta: {},
            });
        }

        const accessToken = await authService.refreshAccessToken(token);

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully.",
            data: { accessToken },
            meta: {},
        });
    } catch (error) {
        // Invalid or expired refresh token — client must log in again
        return res.status(403).json({
            success: false,
            message: "Refresh token is invalid or has expired. Please log in again.",
            data: {},
            meta: {},
        });
    }
};

// ---------------------------------------------------------------------------
// POST /api/v1/auth/logout
// Requires authenticate middleware (401 if token missing, 403 if expired).
// ---------------------------------------------------------------------------
export const logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            // Delete from database to invalidate the token server-side
            await authService.logout(token);
        }

        // Clear the cookie regardless of whether a token was found
        res.clearCookie("refreshToken", refreshTokenCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
            data: {},
            meta: {},
        });
    } catch (error) {
        console.error("[logout] Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
            data: {},
            meta: {},
        });
    }
};

// ---------------------------------------------------------------------------
// GET /api/v1/auth/me
// Requires authenticate middleware. Returns the authenticated user's profile.
// ---------------------------------------------------------------------------
export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                data: {},
                meta: {},
            });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully.",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            meta: {},
        });
    } catch (error) {
        console.error("[me] Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
            data: {},
            meta: {},
        });
    }
};