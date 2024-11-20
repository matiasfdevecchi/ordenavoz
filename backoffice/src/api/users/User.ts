export type UserId = string;

export enum UserRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export type UserProps = {
  id: UserId;
  name: string;
  email: string;
  picture: string;
  role: UserRole;
}

export class User {
  readonly id: UserId;
  readonly name: string;
  readonly email: string;
  readonly picture: string;
  readonly role: UserRole;

  constructor({ id, name, email, picture, role }: UserProps) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.picture = picture;
    this.role = role;
  }

  static NEW_ID = '';

  static new(props: Omit<UserProps, "id">): User {
    return new User({
      ...props,
      id: this.NEW_ID,
    });
  }

  copy(props: Partial<UserProps>): User {
    return new User({
      ...this,
      ...props,
    });
  }

  static fromJson(data: UserProps): User {
    return new User(data);
  }
}