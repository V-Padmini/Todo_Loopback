import {juggler} from '@loopback/repository';
import config from './oracle.datasource.config.json';

export class OracleDataSource extends juggler.DataSource {
  static dataSourceName = 'oracle';
  constructor() { super(config); }
}