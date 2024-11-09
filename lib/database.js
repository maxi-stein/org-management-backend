import { Mongoose } from 'mongoose';

import { roleSchema } from '../components/role/schema.js';
import { userSchema } from '../components/user/schema.js';
import { positionSchema } from '../components/position/schema.js';
import { departmentSchema } from '../components/department/schema.js';
import { areaSchema } from '../components/area/schema.js';

export class Database {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger.child({ context: 'Database' });
    this.logger.verbose('Creating mongoose instance');
    this.mongoose = new Mongoose();
    this.logger.verbose('Mongoose instance created');

    this._setupMongooseModels();
  }

  async connect() {
    this.logger.verbose('Connecting to database');

    const options = {
      maxPoolSize: 25,
    };

    await this.mongoose.connect(this.config.mongo.url, options);

    this.logger.verbose('Connected to database');
  }

  async disconnect() {
    this.logger.verbose('Disconnecting from database');
    await this.mongoose.disconnect();
    this.logger.verbose('Disconnected from database');
  }

  model(...args) {
    return this.mongoose.model(...args);
  }

  async ping() {
    if (!this.mongoose.connection.db) {
      return Promise.reject(new Error('Not connected to database'));
    }
    return this.mongoose.connection.db.admin().ping();
  }

  _setupMongooseModels() {
    this.logger.verbose('Registering models');

    this.mongoose.model('Role', roleSchema);
    this.mongoose.model('User', userSchema);
    this.mongoose.model('Position', positionSchema);
    this.mongoose.model('Area', areaSchema);
    this.mongoose.model('Department', departmentSchema);

    this.logger.verbose('Models registered');
  }
}
