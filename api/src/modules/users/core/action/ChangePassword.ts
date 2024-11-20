import { UserId, UserRole } from "../domain/User";
import { UserRepository, userRepository } from "../domain/UserRepository";
import { PreviousPasswordIsInvalid } from "../domain/errors/PreviousPasswordIsInvalid";

class ChangePassword {
    constructor(private readonly userRepository: UserRepository) { }

    async invoke(id: UserId, previousPassword: string, password: string): Promise<void> {
        if (!await this.userRepository.verifyPassword(id, previousPassword)) {
            throw new PreviousPasswordIsInvalid();
        }
        return this.userRepository.changePassword(id, password);
    }
}

export const changePassword = new ChangePassword(userRepository);