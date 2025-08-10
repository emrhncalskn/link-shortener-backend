import { Router } from "express";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { validate } from "../../utils/validate";
import { updateUserSchema } from "./schema/user.schema";
import { authGuard } from "../auth/auth.guard";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

// Get self user
router.get("/", authGuard, userController.getSelfUser);

// Update user
router.put("/", validate(updateUserSchema), authGuard, userController.update);

// Delete user
router.delete("/", authGuard, userController.delete);

export default router;
