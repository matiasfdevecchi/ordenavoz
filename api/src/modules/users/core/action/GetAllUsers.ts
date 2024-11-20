import { User } from "../domain/User";
import { UserRepository, userRepository } from "../domain/UserRepository";

class GetAllUsers {
    constructor(private readonly userRepository: UserRepository) {}
    
    async invoke(): Promise<User[]> {
        return this.userRepository.getAll();
    }
}

export const getAllUsers = new GetAllUsers(userRepository);