import {post, requestBody} from '@loopback/rest';
import {inject} from '@loopback/core';
import {UserService} from '../services/user.service';

export class UserController {
  constructor(
    @inject('services.UserService')
    public userService: UserService,
  ) {}

@post('/signup', {
  security: [],
  responses: {
    '200': {
      description: 'New user created',
    },
  },
})
async signup(
  @requestBody({
    description: 'Signup details',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: [
            'username',
            'password',
            'confirmPassword',
          ],
          properties: {
            username: {
              type: 'string',
              example: 'padmini',
              description: 'Enter username',
            },
            password: {
              type: 'string',
              example: 'Password123',
              description: 'Enter password',
            },
            confirmPassword: {
              type: 'string',
              example: 'Password123',
              description:
                'Re-enter password for confirmation',
            },
          },
        },
      },
    },
  })
  body: {
    username: string;
    password: string;
    confirmPassword: string;
  },
) {

  if (body.password !== body.confirmPassword) {
    return {
      message: 'Passwords do not match',
    };
  }

  return this.userService.signup(
    body.username,
    body.password,
  );
}

  @post('/login', {
    security: [],
    responses: {
      '200': {
        description: 'Login success',
      },
    },
  })
  async login(
    @requestBody({
      description: 'Login credentials',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {
                type: 'string',
                example: 'padmini',
              },
              password: {
                type: 'string',
                example: 'Password123',
              },
            },
          },
        },
      },
    })
    body: {username: string; password: string},
  ) {
    const res = await this.userService.login(
      body.username,
      body.password,
    );

    if (!res) {
      return {message: 'Invalid credentials'};
    }

    return res;
  }
}