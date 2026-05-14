import {post, get, put, del, param, requestBody} from '@loopback/rest';
import {inject} from '@loopback/core';
import {TodoService} from '../services/todo.service';
import {Todo} from '../models/todo.model';

export class TodoController {
  constructor(@inject('services.TodoService') public todoService: TodoService) {}

  @post('/todos')
  async create(@requestBody() todo: Partial<Todo>) {
    return this.todoService.createTodo(todo);
  }

  @get('/todos')
  async find(@param.query.string('username') username: string) {
    return this.todoService.getTodos(username);
  }

  @put('/todos/{id}')
  async update(
    @param.path.number('id') id: number,
    @requestBody() todo: Partial<Todo>
  ) {
    return this.todoService.updateTodo(id, todo);
  }

  @del('/todos/{id}')
  async delete(@param.path.number('id') id: number) {
    await this.todoService.deleteTodo(id);
    return {message: `Todo with id ${id} deleted`};
  }
}