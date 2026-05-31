import {
  post,
  get,
  put,
  del,
  param,
  requestBody,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {TodoService} from '../services/todo.service';
import {authenticate} from '@loopback/authentication';
import {
  UserProfile,
  securityId,
} from '@loopback/security';

@authenticate('jwt')
export class TodoController {
  constructor(
    @inject('services.TodoService')
    public todoService: TodoService,
  ) {}

  // ================= CREATE TODO =================
  @post('/todos')
  async create(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @requestBody({
      description: 'Create Todo',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['title'],
            properties: {
              title: {
                type: 'string',
                example: 'Learn LoopBack',
              },
              description: {
                type: 'string',
                example:
                  'Complete JWT authentication',
              },
            },
          },
        },
      },
    })
    todo: {
      title: string;
      description?: string;
    },
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService.createTodo(
      userId,
      todo,
    );
  }

  // ================= SIMPLE SEARCH =================
  @get('/todos')
  async findTodos(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @param.query.string('keyword', {
      description: 'Search keyword',
      example: 'learn',
    })
    keyword?: string,
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService.searchTodos(
      userId,
      keyword || '',
    );
  }

  // ================= ADVANCED SEARCH =================
  @get('/todos/filter')
  async advancedFind(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @param.query.string('keyword', {
      description: 'Search keyword',
      example: 'java',
    })
    keyword?: string,

    @param.query.boolean('completed', {
      description:
        'Filter by completed status',
      example: true,
    })
    completed?: boolean,
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService
      .advancedSearchTodos(
        userId,
        keyword,
        completed,
      );
  }

  // ================= PAGINATION =================
  @get('/todos/pagination')
  async pagination(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @param.query.number('page', {
      example: 1,
    })
    page = 1,

    @param.query.number('limit', {
      example: 5,
    })
    limit = 5,
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService
      .getTodosPagination(
        userId,
        page,
        limit,
      );
  }

  // ================= STATS =================
  @get('/todos/stats')
  async stats(
    @inject('authentication.currentUser')
    currentUser: UserProfile,
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService
      .getTodoStats(userId);
  }

  // ================= TOGGLE STATUS =================
  @put('/todos/{id}/status')
  async toggleStatus(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @param.path.number('id', {
      description: 'Todo ID',
      example: 1,
    })
    id: number,
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService.toggleStatus(
      userId,
      id,
    );
  }

  // ================= DELETE TODO =================
  @del('/todos/{id}')
  async delete(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @param.path.number('id', {
      description: 'Todo ID',
      example: 1,
    })
    id: number,
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    await this.todoService.deleteTodo(
      userId,
      id,
    );

    return {
      message:
        `Todo ${id} deleted successfully`,
    };
  }
}