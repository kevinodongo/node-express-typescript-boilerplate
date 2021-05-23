/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Joi from 'joi';
import httpStatus from 'http-status';
import FormatObject from '../utils/FormatObject';
import ApiError from '../utils/ApiError';

// validate schema
const validate = (schema: any) => (req: any, res: any, next: any) => {
  const validSchema = FormatObject(schema, ['params', 'query', 'body']);
  const object = FormatObject(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, false, ''));
  }
  Object.assign(req, value);
  return next();
};
export default validate