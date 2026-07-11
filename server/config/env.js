/**
 * config/env.js
 *
 * Validates that all required environment variables are set at startup.
 * The server will refuse to start if any required variable is missing,
 * preventing accidental deployment with incomplete or insecure configuration.
 *
 * Call this AFTER dotenv.config() in server.js.
 */

const REQUIRED_ENV_VARS = [
    "PORT",
    "MONGO_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "ACCESS_TOKEN_EXPIRE",
    "REFRESH_TOKEN_EXPIRE",
    "FRONTEND_URL",
];

export function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error(
            `[startup] FATAL: Missing required environment variables:\n  ${missing.join("\n  ")}\n` +
            "Server cannot start without these values. Check your .env file."
        );
        process.exit(1); // Fail fast — do not start in an insecure state
    }

    // TODO(security): In production, validate that JWT secrets meet a minimum
    // entropy requirement (e.g., length >= 32 chars) and were not left as
    // default placeholder values.
    if (process.env.NODE_ENV === "production") {
        const weakSecrets = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"].filter(
            (key) => process.env[key].length < 32
        );
        if (weakSecrets.length > 0) {
            console.error(
                `[startup] FATAL: The following secrets are too short for production (< 32 chars):\n  ${weakSecrets.join("\n  ")}`
            );
            process.exit(1);
        }
    }
}
