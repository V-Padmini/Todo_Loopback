import {
  post,
  get,
  put,
  del,
  param,
  requestBody,
} from '@loopback/rest';

import {inject} from '@loopback/core';

import {authenticate} from '@loopback/authentication';

import {
  UserProfile,
  securityId,
} from '@loopback/security';

import {TodoService} from '../services/todo.service';

@authenticate('jwt')
export class TodoController {
  constructor(
    @inject('services.TodoService')
    public todoService: TodoService,
  ) {}

  // ================= CREATE TODO =================
  @post('/todos', {
    responses: {
      '200': {
        description:
          'Create a new todo',
      },
    },
  })
  async createTodo(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @requestBody({
      description: 'Todo details',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['title'],
            properties: {
              title: {
                type: 'string',
                example: 'Workout',
                description:
                  'Enter todo title',
              },
              description: {
                type: 'string',
                example:
                  'Go to gym at 6 PM',
                description:
                  'Enter todo description',
              },
            },
          },
        },
      },
    })
    body: {
      title: string;
      description?: string;
    },
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService.createTodo(
      userId,
      body,
    );
  }

  // ================= GET TODOS + FILTER =================
  @get('/todos', {
  responses: {
    '200': {
      description:
        'Get logged in user todos',
    },
  },
})
async getTodos(
  @inject('authentication.currentUser')
  currentUser: UserProfile,

  @param.query.string(
    'keyword',
    {
      description:
        'Search keyword',
      example: 'study',
    },
  )
  keyword?: string,

  @param.query.boolean(
    'completed',
    {
      description:
        'Completed status',
      example: true,
    },
  )
  completed?: boolean,
) {
  const userId = Number(
    currentUser[securityId],
  );

  return this.todoService.searchTodos(
    userId,
    keyword,
    completed,
  );
}
  // ================= PAGINATION =================
  @get('/todos/pagination', {
    responses: {
      '200': {
        description:
          'Get paginated todos',
      },
    },
  })
  async pagination(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @param.query.number(
      'page',
      {
        description:
          'Page number',
        example: 1,
      },
    )
    page = 1,

    @param.query.number(
      'limit',
      {
        description:
          'Number of todos per page',
        example: 5,
      },
    )
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

  // ================= TODO STATS =================
  @get('/todos/stats', {
    responses: {
      '200': {
        description:
          'Get todo statistics',
      },
    },
  })
  async stats(
    @inject('authentication.currentUser')
    currentUser: UserProfile,
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService.getTodoStats(
      userId,
    );
  }

  // ================= UPDATE TODO =================
@put('/todos/{id}', {
  responses: {
    '200': {
      description:
        'Update todo',
    },
  },
})
async updateTodo(
  @inject('authentication.currentUser')
  currentUser: UserProfile,

  @param.path.number(
    'id',
    {
      description:
        'Todo ID',
      example: 1,
    },
  )
  id: number,

  @requestBody({
    description:
      'Updated todo details',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example:
                'Workout Updated',
            },
            description: {
              type: 'string',
              example:
                'Go to gym at 7 PM',
            },
            completed: {
              type: 'boolean',
              example: true,
            },
          },
        },
      },
    },
  })
  body: {
    title?: string;
    description?: string;
    completed?: boolean;
  },
) {
  const userId = Number(
    currentUser[securityId],
  );

  return this.todoService.updateTodo(
    userId,
    id,
    body,
  );
}
  // ================= DELETE TODO =================
  @del('/todos/{id}', {
    responses: {
      '200': {
        description:
          'Delete todo',
      },
    },
  })
  async deleteTodo(
    @inject('authentication.currentUser')
    currentUser: UserProfile,

    @param.path.number(
      'id',
      {
        description:
          'Todo ID',
        example: 1,
      },
    )
    id: number,
  ) {
    const userId = Number(
      currentUser[securityId],
    );

    return this.todoService.deleteTodo(
      userId,
      id,
    );
  }
}