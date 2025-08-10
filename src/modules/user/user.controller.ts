import { Request, Response } from "express";
import { BaseController } from "../../common/base.controller";
import { UserService } from "./user.service";
import { getTokenFromRequest } from "../../utils/jwt";

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      return await this.userService.getAllUsers();
    });
  };

  getSelfUser = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const token = getTokenFromRequest(req);
      return await this.userService.getSelfUser(token!);
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const token = getTokenFromRequest(req);

      const data = req.body;
      return await this.userService.updateUser(token!, data);
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const token = getTokenFromRequest(req);
      return await this.userService.deleteUser(token!);
    });
  };
}
