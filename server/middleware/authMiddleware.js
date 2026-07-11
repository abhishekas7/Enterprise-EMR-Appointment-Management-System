import jwt from "jsonwebtoken";

/**
 * authenticate middleware
 *
 * Verifies the Bearer token from the Authorization header.
 *
 * Status codes:
 *   401 Unauthorized  — token missing or malformed
 *   403 Forbidden     — token signature valid but expired (TokenExpiredError)
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please provide a valid token.",
            data: {},
            meta: {},
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Normalize: JWT payload has `userId`, expose as both `id` and `userId`
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        // Distinguish expired tokens from invalid ones for proper client handling:
        // - 403: client should attempt a silent refresh via the cookie
        // - 401: client should redirect to login
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                success: false,
                message: "Access token has expired. Please refresh your session.",
                data: {},
                meta: {},
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid or malformed token.",
            data: {},
            meta: {},
        });
    }
};

export default authenticate;