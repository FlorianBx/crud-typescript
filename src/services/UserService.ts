import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public createUser(name: string, email: string): User {
    const user = new User(0, name, email);
    return this.userRepository.create(user);
  }

  public getAllUsers(): User[] {
    return this.userRepository.findAll();
  }

  public getUserById(id: number): User | undefined {
    return this.userRepository.findById(id);
  }

  public updateUser(id: number, updatedUser: Partial<User>): User | undefined {
    return this.userRepository.update(id, updatedUser);
  }

  public deleteUser(id: number): boolean {
    return this.userRepository.delete(id);
  }
}
