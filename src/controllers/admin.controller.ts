import {get, del, param, HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {UserService} from '../services/user.service';
import {TodoService} from '../services/todo.service';
import {UserProfile} from '@loopback/security';

@authenticate('jwt')
export class AdminController {
  constructor(
    @inject('services.UserService')
    public userService: UserService,

    @inject('services.TodoService')
    public todoService: TodoService,
  ) {}

  async checkAdmin(user: UserProfile) {
    if (user.role !== 'admin') {
      throw new HttpErrors.Forbidden(
        'Not authorized',
      );
    }
  }

  @get('/admin/users', {
    responses: {
      '200': {
        description:
          'Get all registered users',
      },
    },
  })
  async allUsers(
    @inject('authentication.currentUser')
    user: UserProfile,
  ) {
    await this.checkAdmin(user);
    return this.userService.userRepo.find();
  }
  @del('/admin/users/{id}', {
    responses: {
      '200': {
        description: 'Delete user by ID',
      },
    },
  })
  async deleteUser(
    @inject('authentication.currentUser')
    user: UserProfile,

    @param.path.number('id', {
      description:
        'User ID to delete',
      example: 1,
    })
    id: number,
  ) {
    await this.checkAdmin(user);
    return this.userService.userRepo.deleteById(
      id,
    );
  }

  @get('/admin/todos', {
    responses: {
      '200': {
        description:
          'Get all todos of all users',
      },
    },
  })
  async allTodos(
    @inject('authentication.currentUser')
    user: UserProfile,
  ) {
    await this.checkAdmin(user);
    return this.todoService.todoRepo.find();
  }

  @del('/admin/todos/{id}', {
    responses: {
      '200': {
        description: 'Delete todo by ID',
      },
    },
  })
  async deleteTodo(
    @inject('authentication.currentUser')
    user: UserProfile,

    @param.path.number('id', {
      description:
        'Todo ID to delete',
      example: 1,
    })
    id: number,
  ) {
    await this.checkAdmin(user);
    return this.todoService.todoRepo.deleteById(
      id,
    );
  }

  @get('/admin/search-users')
async searchUsers(
  @inject('authentication.currentUser')
  user: UserProfile,

  @param.query.string('keyword')
  keyword?: string,
) {
  await this.checkAdmin(user);

  return this.userService
    .searchUsers(keyword || '');
}

@get('/admin/top-users')
async topUsers(
  @inject('authentication.currentUser')
  user: UserProfile,
) {
  await this.checkAdmin(user);

  return this.todoService.topUsers();
}

@get('/admin/analytics')
async analytics(
  @inject('authentication.currentUser')
  user: UserProfile,
) {
  await this.checkAdmin(user);

  return this.todoService
    .adminAnalytics();
}
}