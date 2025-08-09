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

  getById = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const id = req.params.id;
      return await this.userService.getUserById(id);
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const data = req.body;
      return await this.userService.createUser(data);
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const id = req.params.id;
      const data = req.body;
      return await this.userService.updateUser(id, data);
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const id = req.params.id;
      return await this.userService.deleteUser(id);
    });
  };
}
