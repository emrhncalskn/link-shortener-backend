import { decode } from "jsonwebtoken";
import { httpException } from "../../utils/response";
import { UserModel } from "./schema/user.model";
import { CreateUserInput, User, UserResponse } from "./schema/user.types";
import { ERROR_MESSAGES } from "../../constants/error-messages.constant";

export class UserService {
  async getSelfUser(userId: string): Promise<UserResponse> {
    const user = await UserModel.findById(userId)
      .select("-password")
      .lean()
      .exec();
    if (!user) {
      throw httpException.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return {
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username }).lean<User>().exec();
  }

  async createUser(userData: CreateUserInput): Promise<UserResponse> {
    const isExist = await this.getUserByUsername(userData.username);
    if (isExist) {
      throw httpException.conflict(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    try {
      const user = new UserModel(userData);
      const savedUser = await user.save();

      return {
        _id: savedUser._id,
        username: savedUser.username,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };
    } catch (error) {
      throw httpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_CREATE_USER
      );
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<CreateUserInput>
  ): Promise<UserResponse> {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw httpException.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    Object.assign(user, userData);
    try {
      const updatedUser = await user.save();
      return {
        _id: updatedUser._id,
        username: updatedUser.username,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      throw httpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_UPDATE_USER
      );
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.getSelfUser(userId);
    try {
      await UserModel.findByIdAndDelete(user._id).exec();
      return;
    } catch (error) {
      throw httpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_DELETE_USER
      );
    }
  }
}
