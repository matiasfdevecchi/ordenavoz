import { UserId, UserRole } from "../domain/User";
import { UserRepository, userRepository } from "../domain/UserRepository";
import { InsuficientPermissions } from "../domain/errors/InsuficientPermissions";
import { UserNotFound } from "../domain/errors/UserNotFound";

class ResetPassword {
    constructor(private readonly userRepository: UserRepository) {}
    
    async invoke(id: UserId, password: string, role: UserRole): Promise<void> {
        if (role !== UserRole.OWNER && role !== UserRole.MANAGER) {
            throw new InsuficientPermissions();
        }
        const user = await this.userRepository.getById(id);
        if (!user) {
            throw new UserNotFound(id);
        }
        if (user.role === UserRole.OWNER && role !== UserRole.OWNER) {
            throw new InsuficientPermissions();
        }

        return this.userRepository.changePassword(id, password);
    }
}

export const resetPassword = new ResetPassword(userRepository);