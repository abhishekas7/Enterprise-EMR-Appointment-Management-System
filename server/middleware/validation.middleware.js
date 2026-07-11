/**
 * validation.middleware.js
 *
 * Reusable Express middleware for input validation.
 * Returns structured error responses before requests reach controllers,
 * keeping controllers clean and reducing unnecessary DB queries.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Validates login request body.
 *
 * Status codes:
 *   400 Bad Request    — required field is missing entirely
 *   422 Unprocessable  — field present but format/length is invalid
 */
export const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body ?? {};

  // --- Presence checks (400) ---
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: !email
        ? 'Email is required.'
        : 'Password is required.',
      data: {},
      meta: {},
    });
  }

  // --- Format checks (422) ---
  if (!EMAIL_REGEX.test(email)) {
    return res.status(422).json({
      success: false,
      message: 'Invalid email format.',
      data: {},
      meta: {},
    });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(422).json({
      success: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      data: {},
      meta: {},
    });
  }

  // All checks passed — proceed to controller
  next();
};
