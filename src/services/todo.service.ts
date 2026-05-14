import {injectable, BindingScope} from '@loopback/core';
import {TodoRepository} from '../repositories/todo.repository';
import {repository} from '@loopback/repository';
import {Todo} from '../models/todo.model';

@injectable({scope: BindingScope.TRANSIENT})
export class TodoService {
  constructor(@repository(TodoRepository) public todoRepo: TodoRepository) {}

  async createTodo(todo: Partial<Todo>): Promise<Todo> {
    if (!todo.title) throw new Error('Title is required');
    return this.todoRepo.create(todo);
  }

  async getTodos(username: string): Promise<Todo[]> {
    return this.todoRepo.find({where: {username}});
  }

  async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    await this.todoRepo.updateById(id, todo);
    return this.todoRepo.findById(id);
  }

  async deleteTodo(id: number): Promise<void> {
    await this.todoRepo.deleteById(id);
  }
}