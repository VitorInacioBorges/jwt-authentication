// creates all express routes and passes the ids to the validate middleware

import { Router } from "express";
import user_controller from "../controllers/user_controllers.js";
import { ensureValidId } from "../middlewares/validate_middleware.js";

const router = Router();

router.post("/user", user_controller.create);
router.get("/users", user_controller.list);
router.get("/users/:id", ensureValidId, user_controller.get);
router.put("/users/:id", ensureValidId, user_controller.update);
router.delete("/users/:id", ensureValidId, user_controller.delete);

export default router;
