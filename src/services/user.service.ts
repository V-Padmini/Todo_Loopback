import {injectable, BindingScope} from '@loopback/core';
import {UserRepository} from '../repositories/user.repository';
import {repository} from '@loopback/repository';
import {User} from '../models/user.model';
import {genSalt, hash, compare} from 'bcryptjs';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(@repository(UserRepository) public userRepo: UserRepository) {}

  async signup(username: string, password: string): Promise<User> {
    const salt = await genSalt(10);
    const hashed = await hash(password, salt);
    return this.userRepo.create({username, password: hashed});
  }

  async login(username: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({where: {username}});
    if (!user) return null;
    const match = await compare(password, user.password);
    return match ? user : null;
  }
}