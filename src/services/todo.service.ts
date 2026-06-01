import {injectable, inject} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
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
      title: todo.title,
      description: todo.description,
      completed: false,
      userId,
    });
  }

  // ================= GET TODOS + FILTER =================
  async searchTodos(
    userId: number,
    keyword?: string,
    completed?: boolean,
  ) {
    const where: Where<Todo> = {
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
    };

    return this.todoRepo.find({
      where,
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
      order: ['id DESC'],
      limit,
      skip: (page - 1) * limit,
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

  // ================= UPDATE TODO =================
  async updateTodo(
    userId: number,
    id: number,
    updatedData: Partial<Todo>,
  ) {
    const todo =
      await this.todoRepo.findById(
        id,
      );

    // only owner can edit
    if (todo.userId !== userId) {
      throw new HttpErrors.Forbidden(
        'Not authorized',
      );
    }

    await this.todoRepo.updateById(
      id,
      updatedData,
    );

    return this.todoRepo.findById(
      id,
    );
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

    // only owner
    if (todo.userId !== userId) {
      throw new HttpErrors.Forbidden(
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

    // only owner
    if (todo.userId !== userId) {
      throw new HttpErrors.Forbidden(
        'Not authorized',
      );
    }

    await this.todoRepo.deleteById(
      id,
    );

    return {
      message:
        'Todo deleted successfully',
    };
  }

  // ================= ADMIN: TOP USERS =================
  async topUsers() {
    const query = `
      SELECT USERID AS "userId",
             COUNT(*) AS "totalTodos"
      FROM TODOS
      GROUP BY USERID
      ORDER BY COUNT(*) DESC
    `;

    return this.dataSource.execute(
      query,
    );
  }

  // ================= ADMIN ANALYTICS =================
  async adminAnalytics() {
    const query = `
      SELECT U.USERNAME AS "username",
             COUNT(T.ID) AS "totalTodos"
      FROM USERS U
      LEFT JOIN TODOS T
        ON U.ID = T.USERID
      GROUP BY U.USERNAME
      ORDER BY COUNT(T.ID) DESC
    `;

    return this.dataSource.execute(
      query,
    );
  }
}