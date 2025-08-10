import { sign } from "jsonwebtoken";
import { comparePassword } from "../../utils/encrypt";
import { HttpException } from "../../utils/response";
import { UserService } from "../user/user.service";

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(username: string, password: string) {
    try {
      const user = await this.userService.getUserByUsername(username);
      if (!user) {
        throw HttpException.notFound("User not found");
      }
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw HttpException.unauthorized("Invalid credentials");
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
      throw HttpException.internalServerError("Failed to login");
    }
  }

  async register(username: string, password: string) {
    try {
      const newUser = await this.userService.createUser({
        username,
        password,
      });
      if (!newUser) {
        throw HttpException.internalServerError("Failed to create user");
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
      throw HttpException.internalServerError("Failed to register user");
    }
  }
}
