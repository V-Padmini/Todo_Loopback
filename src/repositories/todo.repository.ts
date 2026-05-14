import {DefaultCrudRepository} from '@loopback/repository';
import {Todo} from '../models/todo.model';
import {OracleDataSource} from '../datasources/oracle.datasource';
import {inject} from '@loopback/core';

export class TodoRepository extends DefaultCrudRepository<Todo, typeof Todo.prototype.id> {
  constructor(@inject('datasources.oracle') dataSource: OracleDataSource) {
    super(Todo, dataSource);
  }
}