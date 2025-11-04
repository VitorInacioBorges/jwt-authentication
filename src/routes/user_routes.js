// creates all express routes and passes the ids to the validate middleware

import { Router } from "express";
import user_controller from "../controllers/user_controllers.js";
import { ensureValidId } from "../middlewares/validate_middleware.js";
import { authMiddleware, requireRole } from "../middlewares/auth_middleware.js";

const router = Router();

// Public routes
router.post("/user", user_controller.create);

router.post("/user/login", authMiddleware(), user_controller.login);

router.get("/users/:id", authMiddleware(), ensureValidId, user_controller.get);

router.put(
  "/users/:id",
  authMiddleware(),
  ensureValidId,
  user_controller.update
);

// Admin Routes
router.get(
  "/users",
  authMiddleware(),
  requireRole("ADMIN"),
  user_controller.list
);

router.delete(
  "/users/:id",
  authMiddleware(),
  requireRole("ADMIN"),
  ensureValidId,
  user_controller.delete
);

export default router;
