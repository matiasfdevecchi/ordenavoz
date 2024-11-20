import { User, UserId, UserRole } from "../domain/User";
import { UserRepository, userRepository } from "../domain/UserRepository";
import { InsuficientPermissions } from "../domain/errors/InsuficientPermissions";

class ReplaceRole {
    constructor(private readonly userRepository: UserRepository) {}
    
    async invoke(id: UserId, role: UserRole, userRole: UserRole): Promise<User> {
        if (userRole !== UserRole.OWNER && role !== UserRole.MANAGER) {
            throw new InsuficientPermissions();
        }
        if (role === UserRole.OWNER && userRole !== UserRole.OWNER) {
            throw new InsuficientPermissions();
        }
        return this.userRepository.replaceRole(id, role);
    }
}

export const replaceRole = new ReplaceRole(userRepository);