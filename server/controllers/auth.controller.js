export const login = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login API",
        data: {},
        meta: {}
    });
};

export const refreshToken = async (req, res) => {
    res.json({
        success: true,
        message: "Refresh Token API",
        data: {},
        meta: {}
    });
};

export const logout = async (req, res) => {
    res.json({
        success: true,
        message: "Logout API",
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