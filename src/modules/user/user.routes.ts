import { Router } from "express";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { validate } from "../../utils/validate";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "./schema/user.schema";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

// Get all users
router.get("/", userController.getAll);

// Get user by ID
router.get("/:id", validate(getUserSchema), userController.getById);

// Create a new user
router.post("/", validate(createUserSchema), userController.create);

// Update user
router.put("/:id", validate(updateUserSchema), userController.update);

// Delete user
router.delete("/:id", validate(getUserSchema), userController.delete);

export default router;
