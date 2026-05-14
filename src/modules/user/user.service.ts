import { User } from "../../models/user.model";

class UserService {
    async getMe(userId: string) {
        return User.findOne({ _id: userId }, { password: 0, __v: 0 });
    }

    async getList() {
        return User.find({}, { password: 0, __v: 0 });
    }

    async updateStatus(id: string, status: boolean) {
        return User.updateOne({ _id: id }, { isActive: status })
    }
}

export default new UserService()