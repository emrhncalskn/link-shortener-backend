import { decode } from "jsonwebtoken";
import { httpException } from "../../utils/response";
import { UserModel } from "./schema/user.model";
import { CreateUserInput, User, UserResponse } from "./schema/user.types";

export class UserService {
  async getAllUsers(page = 1, limit = 10): Promise<UserResponse[]> {
    const skip = (page - 1) * limit;
    const users = await UserModel.find()
      .skip(skip)
      .limit(limit)
      .select("-password")
      .lean()
      .exec();

    return users.map((user) => ({
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async getSelfUser(userId: string): Promise<UserResponse> {
    const user = await UserModel.findById(userId)
      .select("-password")
      .lean()
      .exec();
    if (!user) {
      throw httpException.notFound("User not found");
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
      throw httpException.conflict("User already exists.");
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
      throw httpException.internalServerError("Failed to create user");
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<CreateUserInput>
  ): Promise<UserResponse> {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw httpException.notFound("User not found");
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
      throw httpException.internalServerError("Failed to update user");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.getSelfUser(userId);
    try {
      await UserModel.findByIdAndDelete(user._id).exec();
      return;
    } catch (error) {
      throw httpException.internalServerError("Failed to delete user");
    }
  }
}
