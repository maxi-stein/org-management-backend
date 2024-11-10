import { Server } from './server.js';
import { Database } from './database.js';

export class BaseApi {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger.child({ context: 'API' });
    this.isRunning = false;
    this.database = new Database(config, this.logger);
    this.server = new Server(config, this.logger, this.database);
  }

  async start() {
    if (this.isRunning) {
      throw new Error('Cannot start the API because it is already running');
    }
    this.isRunning = true;

    this.logger.verbose('Starting the API');
    await Promise.all([this.database.connect(), this.server.listen()]);
    this.logger.verbose('API ready and awaiting requests');

    return { url: this.config.server.url };
  }

  async stop() {
    if (!this.isRunning) {
      throw new Error('Cannot stop the API because it is already stopped');
    }
    this.isRunning = false;

    this.logger.verbose('Stopping API');
    await Promise.all([this.database.disconnect(), this.server.close()]);
    this.logger.verbose(
      'API has closed all connections and successfully halted',
    );
  }
}
