import { GetUsers200ResponseOneOfInner, ManagementApiError, ManagementClient } from "auth0";
import { User, UserId, UserRole } from "../core/domain/User";
import { CreateParams, UserRepository } from "../core/domain/UserRepository";
import { PasswordTooWeak } from "../core/domain/errors/PasswordTooWeak";
import { UserAlreadyExists } from "../core/domain/errors/UserAlreadyExists";
import { InvalidState } from "../../shared/domain/errors/InvalidState";
import { Resource } from "../../shared/domain/errors/HandledError";
import axios from "axios";

export class Auth0UserRepository implements UserRepository {
    private managementClient: ManagementClient;
    private readonly domain: string;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly audience: string;

    constructor() {
        const domain = process.env.AUTH0_DOMAIN;
        const clientId = process.env.AUTH0_CLIENT_ID;
        const clientSecret = process.env.AUTH0_CLIENT_SECRET;
        const audience = process.env.AUTH0_AUDIENCE;

        if (!domain || !clientId || !clientSecret || !audience) {
            throw new Error('Missing Auth0 credentials');
        }

        this.domain = domain;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.audience = audience;

        this.managementClient = new ManagementClient({
            domain,
            clientId,
            clientSecret,
        })
    }

    async create({ name, email, password, role }: CreateParams): Promise<User> {
        try {
            const response = await this.managementClient.users.create({
                email,
                email_verified: true,
                connection: 'Username-Password-Authentication',
                password,
                name,
                verify_email: false,
                app_metadata: {
                    role,
                }
            });

            if (response.status !== 201)
                throw new Error(`Error creating user with code ${response.status}: ${response.statusText}`);

            return this.fromDto(response.data);
        } catch (error: any) {
            if (error instanceof ManagementApiError) {
                if (error.msg.startsWith('PasswordStrengthError')) {
                    throw new PasswordTooWeak();
                }
                if (error.msg.startsWith('The user already exists')) {
                    throw new UserAlreadyExists(email);
                }
                if (error.msg.includes("Object didn't pass validation for format email")) {
                    throw new InvalidState(Resource.USER, { email }, 'Invalid email');
                }
            }

            console.error('Error creating user in Auth0:', error);
            throw new Error('Error creating user');
        }
    }

    async getAll(): Promise<User[]> {
        try {
            const users = await this.managementClient.users.getAll();
            return users.data.map(this.fromDto);
        } catch (error) {
            console.error('Error fetching users from Auth0:', error);
            throw new Error('Error fetching users');
        }
    }

    async getById(id: UserId): Promise<User | undefined> {
        try {
            const user = await this.managementClient.users.get({ id });
            return this.fromDto(user.data);
        } catch (error) {
            console.error('Error fetching user from Auth0:', error);
            throw new Error('Error fetching user');
        }
    }

    async assignRole(userId: string, role: UserRole): Promise<User> {
        return this.assignRoleToUser(userId, role);
    }

    async replaceRole(userId: string, role: UserRole): Promise<User> {
        return this.assignRoleToUser(userId, role);
    }

    async verifyPassword(userId: UserId, password: string): Promise<boolean> {
        try {
            const user = await this.managementClient.users.get({ id: userId, fields: 'email' });
            const email = user.data.email;

            await axios.post(`https://${this.domain}/oauth/token`, {
                grant_type: 'password',
                username: email,
                password: password,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                scope: 'openid',
                audience: this.audience,
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    async changePassword(userId: UserId, password: string): Promise<void> {
        try {
            await this.managementClient.users.update({ id: userId }, { password });
        } catch (error: any) {
            if (error instanceof ManagementApiError) {
                if (error.msg.startsWith('PasswordStrengthError')) {
                    throw new PasswordTooWeak();
                }
            }

            console.error('Error changing password in Auth0:', error);
            throw new Error('Error changing password');
        }
    }

    async changeName(userId: UserId, name: string): Promise<void> {
        try {
            await this.managementClient.users.update({ id: userId }, { name });
        } catch (error) {
            console.error('Error changing name in Auth0:', error);
            throw new Error('Error changing name');
        }
    }

    async delete(userId: UserId): Promise<void> {
        return this.managementClient.users.delete({ id: userId }).then(() => { });
    }

    private assignRoleToUser(userId: string, role: UserRole): Promise<User> {
        return this.managementClient.users
            .update({ id: userId }, { app_metadata: { role } })
            .then(response => this.fromDto(response.data));
    }

    private fromDto(user: GetUsers200ResponseOneOfInner): User {
        return new User({
            id: user.user_id,
            name: user.name || '',
            email: user.email,
            picture: user.picture,
            role: user.app_metadata?.role || UserRole.EMPLOYEE,
        })
    }
}