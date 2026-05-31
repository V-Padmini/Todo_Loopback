import {Entity, model, property} from '@loopback/repository';

@model({settings:{oracle:{table:'USERS'}}})
export class User extends Entity {
  @property({type:'number', id:true, generated:true})
  id?: number;

  @property({
    type:'string',
    required:true,
    jsonSchema: { minLength: 3, maxLength: 30 }
  })
  username!: string;

  @property({
    type:'string',
    required:true,
    jsonSchema: { minLength: 6 }
  })
  password!: string;

  @property({type:'string', default:'user'})
  role?: string;

  constructor(data?: Partial<User>){ super(data); }
}