import {injectable, /* inject */} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories/user.repository';
import {hash, compare} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../keys';
import {User} from '../models/user.model';

@injectable()
export class UserService {
  constructor(@repository(UserRepository) public userRepo: UserRepository) {}

  async signup(username: string, password: string, role = 'user'): Promise<User> {
    const hashed = await hash(password, 10);
    return this.userRepo.create({username, password: hashed, role});
  }

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({where: {username}});
    if (!user) return null;

    const match = await compare(password, user.password);
    if (!match) return null;

    const token = jwt.sign({id: user.id, username: user.username, role: user.role}, JWT_SECRET, {expiresIn: '1h'});
    return {user, token};
  }

  async searchUsers(keyword: string) {
  return this.userRepo.find({
    where: {
      username: {
        like: `%${keyword}%`,
      },
    },
  });
}
}