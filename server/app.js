import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API Running Successfully"
    });
});

export default app;