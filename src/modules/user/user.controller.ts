import { Request, Response } from "express";
import { BaseController } from "../../common/base.controller";
import { UserService } from "./user.service";

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  getSelfUser = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const userId = (req as any).user?.id;
      return await this.userService.getSelfUser(userId);
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const userId = (req as any).user?.id;
      const data = req.body;
      return await this.userService.updateUser(userId, data);
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const userId = (req as any).user?.id;
      return await this.userService.deleteUser(userId);
    });
  };
}
