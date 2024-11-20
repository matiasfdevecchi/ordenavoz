import { User, UserRole } from "../domain/User";
import { CreateParams, UserRepository, userRepository } from "../domain/UserRepository";
import { InsuficientPermissions } from "../domain/errors/InsuficientPermissions";

class CreateUser {
    constructor(private readonly userRepository: UserRepository) {}
    
    async invoke(role: UserRole, params: CreateParams): Promise<User> {
        if (role !== UserRole.OWNER && role !== UserRole.MANAGER) {
            throw new InsuficientPermissions();
        }
        if (params.role === UserRole.OWNER && role !== UserRole.OWNER) {
            throw new InsuficientPermissions();
        }
        return this.userRepository.create(params);
    }
}

export const createUser = new CreateUser(userRepository);