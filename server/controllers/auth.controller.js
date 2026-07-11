import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false, message: "Invalid email or password"

        });

    }

    const match = await bcrypt.compare(password, user.password); if (!match) {
        return res.status(401).json({
            success: false, message: "Invalid email or password"

        });
    }

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

    const refreshToken = jwt.sign(
        {
            userId: user._id,   
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        }
    );

    // Persist refresh token in the database
    await authService.saveRefreshToken(user._id, refreshToken);

    return res.json({
        success: true, message: "Login successful", data: {
            accessToken, refreshToken, user: {
                id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role
            }
        },
        meta: {}
    });

};

export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
        data: {},
        meta: {},
      });
    }

    const refreshToken = authHeader.split(" ")[1];

    const accessToken = await authService.refreshAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken,
      },
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
    const { refreshToken } = req.body || {};

    if (refreshToken) {
        // await authService.logout(refreshToken); // Note: authService needs to be imported or implemented
    }

    return res.status(200).json({

        success: true,

        message: "Logout successful",

        data: {},

        meta: {}

    });
};

export const profile = async (req, res) => {
    res.json({
        success: true,
        message: "Profile API",
        data: {},
        meta: {}
    });
};