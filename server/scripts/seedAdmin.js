import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const existing = await User.findOne({
    email: "admin@hospital.com"
});

if (existing) {
    console.log("Admin already exists");
    process.exit();
}

const password = await bcrypt.hash("Password@123",10);

await User.create({

    firstName:"Super",

    lastName:"Admin",

    email:"admin@hospital.com",

    password,

    role:"SUPER_ADMIN"

});

console.log("Super Admin Created");

process.exit();