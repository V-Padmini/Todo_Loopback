import {DefaultCrudRepository} from '@loopback/repository';
import {User} from '../models/user.model';
import {OracleDataSource} from '../datasources/oracle.datasource';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id> {
  constructor(@inject('datasources.oracle') dataSource: OracleDataSource) {
    super(User, dataSource);
  }
}