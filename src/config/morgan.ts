/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import morgan from 'morgan';
import config from './config';
import logger from './logger';

morgan.token('message', (req: any, res: any) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const morganSuccessHandler = morgan(successResponseFormat, {
  skip: (req: any, res: any) => res.statusCode >= 400,
  stream: { write: (message: any) => logger.info(message.trim()) },
});

export const morganErrorHandler = morgan(errorResponseFormat, {
  skip: (req: any, res: any) => res.statusCode < 400,
  stream: { write: (message: any) => logger.error(message.trim()) },
});