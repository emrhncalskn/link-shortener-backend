import { Router } from "express";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

// Get all users
router.get("/", userController.getAll);

export default router;
