import { Auth0UserRepository } from "../../infrastructure/Auth0UserRepository";
import { User, UserId, UserRole } from "./User";

export type CreateParams = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserRepository {
    create(params: CreateParams): Promise<User>;
    getAll(): Promise<User[]>;
    getById(id: UserId): Promise<User | undefined>;
    assignRole(userId: UserId, role: UserRole): Promise<User>;
    replaceRole(userId: UserId, role: UserRole): Promise<User>;
    verifyPassword(userId: UserId, password: string): Promise<boolean>;
    changePassword(userId: UserId, password: string): Promise<void>;
    delete(userId: UserId): Promise<void>;
}

export const userRepository = new Auth0UserRepository();