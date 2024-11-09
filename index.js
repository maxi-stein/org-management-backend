import config from 'config';
import logger from './logger.js';
import { BaseApi } from './lib/baseApi.js';

const baseApi = new BaseApi(config, logger);
baseApi.BaseApi = BaseApi;

export default baseApi;
