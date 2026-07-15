import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createDoctor = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: firstName, lastName, email, and password.",
                data: {},
                meta: {}
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists.",
                data: {},
                meta: {}
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the doctor
        const doctor = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "DOCTOR",
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "Doctor created successfully.",
            data: {
                id: doctor._id,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                email: doctor.email,
                role: doctor.role
            },
            meta: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {},
            meta: {}
        });
    }
};
