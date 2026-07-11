import dotenv from "dotenv";
import { validateEnv } from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load .env first, then validate required variables before anything else runs
dotenv.config();
validateEnv();

await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});