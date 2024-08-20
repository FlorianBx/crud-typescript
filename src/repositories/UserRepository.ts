import { User } from "../models/User";

export class UserRepository {
  private users: User[] = [];
  private currentId = 1;

  public create(user: User): User {
    user.id = this.currentId++;
    this.users.push(user);
    return user;
  }

  public findAll(): User[] {
    return this.users;
  }

  public findById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  public update(id: number, updatedUser: Partial<User>): User | undefined {
    const user = this.findById(id);
    if (!user) return undefined;

    Object.assign(user, updatedUser);
    return user;
  }

  public delete(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}

