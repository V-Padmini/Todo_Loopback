import {Entity, model, property} from '@loopback/repository';

@model({settings:{oracle:{table:'TODOS'}}})
export class Todo extends Entity {
  @property({type:'number', id:true, generated:true})
  id?: number;

  @property({
    type:'string',
    required:true,
    jsonSchema: { minLength: 3, maxLength: 100 }
  })
  title!: string;

  @property({
    type:'string',
    jsonSchema: { maxLength: 255 }
  })
  description?: string;

  @property({type:'boolean', default:false})
  completed?: boolean;

  @property({type:'number'})
  userId?: number;

  constructor(data?: Partial<Todo>){ super(data); }
}