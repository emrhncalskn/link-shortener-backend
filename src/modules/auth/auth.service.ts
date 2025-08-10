import { sign } from "jsonwebtoken";
import { comparePassword } from "../../utils/encrypt";
import { HttpException } from "../../utils/response";
import { UserService } from "../user/user.service";
import { ERROR_MESSAGES } from "../../constants/error-messages.constant";

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(username: string, password: string) {
    try {
      const user = await this.userService.getUserByUsername(username);
      if (!user) {
        throw HttpException.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw HttpException.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
      const token = sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "24h" }
      );

      return token;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw HttpException.internalServerError(ERROR_MESSAGES.FAILED_TO_LOGIN);
    }
  }

  async register(username: string, password: string) {
    try {
      const newUser = await this.userService.createUser({
        username,
        password,
      });
      if (!newUser) {
        throw HttpException.internalServerError(
          ERROR_MESSAGES.FAILED_TO_CREATE_USER
        );
      }
      const token = sign(
        { id: newUser._id, username: newUser.username },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "24h" }
      );

      return {
        token,
        user: {
          _id: newUser._id,
          username: newUser.username,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw HttpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_REGISTER
      );
    }
  }
}
