import {post, requestBody} from '@loopback/rest';
import {inject} from '@loopback/core';
import {UserService} from '../services/user.service';

export class UserController {
  constructor(@inject('services.UserService') public userService: UserService) {}

  @post('/signup')
  async signup(@requestBody() body: {username: string; password: string}) {
    return this.userService.signup(body.username, body.password);
  }

  @post('/login')
  async login(@requestBody() body: {username: string; password: string}) {
    const user = await this.userService.login(body.username, body.password);
    if (!user) return {message: 'Not yet signed up', redirect: '/signup.html'};
    return {message: 'Login successful', user: {username: user.username}};
  }
}