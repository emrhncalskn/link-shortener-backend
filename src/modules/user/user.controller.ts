import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { BaseController } from "../../common/base.controller";

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      return await this.userService.getAllUsers();
    });
  };
}
