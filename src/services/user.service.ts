import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories/user.repository';
import {hash, compare} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../keys';
import {User} from '../models/user.model';

@injectable()
export class UserService {
  constructor(
    @repository(UserRepository)
    public userRepo: UserRepository,
  ) {}

  // ================= SIGNUP =================
  async signup(
    username: string,
    password: string,
    role = 'user',
  ): Promise<User> {
    const existingUser =
      await this.userRepo.findOne({
        where: {username},
      });

    if (existingUser) {
      throw new HttpErrors.BadRequest(
        'Username already exists',
      );
    }

    const hashed =
      await hash(password, 10);

    return this.userRepo.create({
      username,
      password: hashed,
      role,
    });
  }

  // ================= LOGIN =================
  async login(
    username: string,
    password: string,
  ) {
    const user =
      await this.userRepo.findOne({
        where: {username},
      });

    if (!user) {
      return null;
    }

    const match =
      await compare(
        password,
        user.password,
      );

    if (!match) {
      return null;
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    return {
      user,
      token,
    };
  }

  // ================= SEARCH USERS =================
  async searchUsers(
    keyword: string,
  ) {
    return this.userRepo.find({
      where: {
        username: {
          like: `%${keyword}%`,
        },
      },
    });
  }
}