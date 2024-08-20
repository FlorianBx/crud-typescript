import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public createUser = (req: Request, res: Response): void => {
    const { name, email } = req.body;
    const user = this.userService.createUser(name, email);
    res.status(201).json(user);
  };

  public getAllUsers = (_: Request, res: Response): void => {
    const users = this.userService.getAllUsers();
    res.json(users);
  };

  public getUserById = (req: Request, res: Response): void => {
    const { id } = req.params;
    const user = this.userService.getUserById(Number(id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  };

  public updateUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    const updatedUser = req.body;
    const user = this.userService.updateUser(Number(id), updatedUser);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  };

  public deleteUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    const success = this.userService.deleteUser(Number(id));
    if (success) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  };
}

