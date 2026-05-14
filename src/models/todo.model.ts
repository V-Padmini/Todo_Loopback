import {Entity, model, property} from '@loopback/repository';

@model({settings: {oracle: {table: 'TODOS'}}})
export class Todo extends Entity {
  @property({type: 'number', id: true, generated: true})
  id?: number;

  @property({type: 'string', required: true})
  title!: string;

  @property({type: 'string'})
  description?: string;

  @property({type: 'boolean', default: false})
  completed?: boolean;

  @property({type: 'string', required: true})
  username!: string; // store owner

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}