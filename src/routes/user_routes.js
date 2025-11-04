// creates all express routes and passes the ids to the validate middleware

import { Router } from "express";
import user_controller from "../controllers/user_controllers.js";
import { ensureValidId } from "../middlewares/validate_middleware.js";
import { authMiddleware, requireRole } from "../middlewares/auth_middleware.js";

const router = Router();

// Unprotected Routes (no token verification)
router.post("/user", user_controller.create); // generates token

router.post("/user/login", user_controller.login); // generates token

// Protected Routes (token verification)
router.get("/users/:id", authMiddleware(), ensureValidId, user_controller.get);

router.put(
  "/users/:id",
  authMiddleware(),
  ensureValidId,
  user_controller.update
);

router.get(
  // only admin
  "/users",
  authMiddleware(),
  requireRole("ADMIN"),
  user_controller.list
);

router.delete(
  // only admin
  "/users/:id",
  authMiddleware(),
  requireRole("ADMIN"),
  ensureValidId,
  user_controller.delete
);

export default router;
