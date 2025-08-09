import { UserModel, User } from "./schema/user.model";

export class UserService {
  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await UserModel.find().skip(skip).limit(limit).lean<User[]>().exec();
  }
}
