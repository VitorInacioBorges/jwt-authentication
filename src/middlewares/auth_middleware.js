// creates the authorization functions
// one require the roles and the other verifies the json web token(jwt)

import createError from "../utils/app_error.js";
import { tokenValidation } from "../utils/token_functions.js";

export function authMiddleware() {
  return (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(createError("Token not informed.", 401));
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    try {
      const payload = tokenValidation(token);
      req.user = payload;
      next();
    } catch (_error) {
      next(createError("Token is invalid or expired.", 401));
    }
  };
}

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    const roles = req.user?.role;
    if (!roles) {
      return next(createError("Forbidden.", 403));
    }
    const list = Array.isArray(roles) ? roles : [roles];
    const permitted = list.some((r) => allowedRoles.includes(r));
    if (!permitted) {
      return next(createError("Forbidden.", 403));
    }
    next();
  };
}
