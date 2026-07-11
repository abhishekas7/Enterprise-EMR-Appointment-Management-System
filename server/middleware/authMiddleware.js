import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
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
        console.log(req.user);
        

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            data: {},
            meta: {},
        });
    }
};

export default authenticate;