import { UserId, UserRole } from "../domain/User";
import { UserRepository, userRepository } from "../domain/UserRepository";
import { InsuficientPermissions } from "../domain/errors/InsuficientPermissions";

class DeleteUser {
    constructor(private readonly userRepository: UserRepository) {}
    
    async invoke(id: UserId, role: UserRole): Promise<void> {
        if (role !== UserRole.OWNER) {
            throw new InsuficientPermissions();
        }
        return this.userRepository.delete(id);
    }
}

export const deleteUser = new DeleteUser(userRepository);