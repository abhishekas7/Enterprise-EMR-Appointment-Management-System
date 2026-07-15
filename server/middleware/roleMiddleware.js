/**
 * Middleware to authorize specific roles.
 * Must be used AFTER authenticate middleware.
 * @param {...string} roles - Allowed roles (e.g., "SUPER_ADMIN", "DOCTOR")
 */
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: "Role information is missing. Access forbidden.",
                data: {},
                meta: {},
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user.role}) is not authorized to access this resource.`,
                data: {},
                meta: {},
            });
        }

        next();
    };
};
