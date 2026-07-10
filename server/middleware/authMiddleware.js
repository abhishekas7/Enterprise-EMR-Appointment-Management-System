const authMiddleware = (req, res, next) => {
    console.log("Authentication middleware");

    // Add JWT verification here later

    next();
};

export default authMiddleware;