import {injectable, inject} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {TodoRepository} from '../repositories/todo.repository';
import {Todo} from '../models/todo.model';
import {OracleDataSource} from '../datasources/oracle.datasource';

@injectable()
export class TodoService {
  constructor(
    @repository(TodoRepository)
    public todoRepo: TodoRepository,

    @inject('datasources.oracle')
    public dataSource: OracleDataSource,
  ) {}

  // ================= CREATE TODO =================
  async createTodo(
    userId: number,
    todo: Partial<Todo>,
  ) {
    return this.todoRepo.create({
      ...todo,
      userId,
    });
  }

  // ================= SIMPLE SEARCH =================
  async searchTodos(
    userId: number,
    keyword: string,
  ) {
    const where: Where<Todo> = {
      userId,

      or: [
        {
          title: {
            like: `%${keyword}%`,
          },
        },
        {
          description: {
            like: `%${keyword}%`,
          },
        },
      ],
    };

    return this.todoRepo.find({
      where,
      order: ['id DESC'],
    });
  }

  // ================= ADVANCED SEARCH =================
  async advancedSearchTodos(
    userId: number,
    keyword?: string,
    completed?: boolean,
  ) {
    return this.todoRepo.find({
      where: {
        and: [
          {userId},

          completed !== undefined
            ? {completed}
            : {},

          keyword
            ? {
                or: [
                  {
                    title: {
                      like: `%${keyword}%`,
                    },
                  },
                  {
                    description: {
                      like: `%${keyword}%`,
                    },
                  },
                ],
              }
            : {},
        ],
      },

      order: ['id DESC'],
    });
  }

  // ================= PAGINATION =================
  async getTodosPagination(
    userId: number,
    page = 1,
    limit = 5,
  ) {
    return this.todoRepo.find({
      where: {userId},

      limit,

      skip: (page - 1) * limit,

      order: ['id DESC'],
    });
  }

  // ================= SORT TODOS =================
  async sortTodos(
    userId: number,
    field = 'id',
    direction = 'DESC',
  ) {
    return this.todoRepo.find({
      where: {userId},

      order: [
        `${field} ${direction}`,
      ],
    });
  }

  // ================= TODO STATS =================
  async getTodoStats(
    userId: number,
  ) {
    const total =
      await this.todoRepo.count({
        userId,
      });

    const completed =
      await this.todoRepo.count({
        userId,
        completed: true,
      });

    const pending =
      await this.todoRepo.count({
        userId,
        completed: false,
      });

    return {
      total: total.count,
      completed: completed.count,
      pending: pending.count,
    };
  }

  // ================= TOGGLE STATUS =================
  async toggleStatus(
    userId: number,
    id: number,
  ) {
    const todo =
      await this.todoRepo.findById(
        id,
      );

    if (todo.userId !== userId) {
      throw new Error(
        'Not authorized',
      );
    }

    await this.todoRepo.updateById(
      id,
      {
        completed:
          !todo.completed,
      },
    );

    return this.todoRepo.findById(
      id,
    );
  }

  // ================= DELETE TODO =================
  async deleteTodo(
    userId: number,
    id: number,
  ) {
    const todo =
      await this.todoRepo.findById(
        id,
      );

    if (todo.userId !== userId) {
      throw new Error(
        'Not authorized',
      );
    }

    return this.todoRepo.deleteById(
      id,
    );
  }

  // ================= RAW SQL QUERY =================
  // Top users by todo count
  async topUsers() {
    return this.dataSource.execute(`
      SELECT
        USER_ID,
        COUNT(*) AS TOTAL_TODOS
      FROM TODOS
      GROUP BY USER_ID
      ORDER BY TOTAL_TODOS DESC
    `);
  }

  // ================= JOIN + GROUP BY =================
  // Admin analytics
  async adminAnalytics() {
    return this.dataSource.execute(`
      SELECT
        U.USERNAME,
        COUNT(T.ID) AS TOTAL_TODOS
      FROM USERS U
      LEFT JOIN TODOS T
      ON U.ID = T.USER_ID
      GROUP BY U.USERNAME
      ORDER BY TOTAL_TODOS DESC
    `);
  }

  // ================= COMPLEX MULTI-CONDITION =================
  async complexFilter(
    userId: number,
    keyword?: string,
    completed?: boolean,
  ) {
    return this.todoRepo.find({
      where: {
        and: [
          {userId},

          completed !== undefined
            ? {completed}
            : {},

          keyword
            ? {
                or: [
                  {
                    title: {
                      like: `%${keyword}%`,
                    },
                  },
                  {
                    description: {
                      like: `%${keyword}%`,
                    },
                  },
                ],
              }
            : {},
        ],
      },

      order: ['id DESC'],
    });
  }
}