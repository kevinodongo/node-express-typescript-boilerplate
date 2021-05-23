/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../utils/roles';

const verifyCallback = (req: any, resolve: any, reject: any, requiredRights: any) => async (err: any, user: any, info: any) => {
  if (err || info || !user) {

    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate', false, err.stack));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight: any) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden', false, err.stack));
    }
  }

  resolve();
};

export const auth = (...requiredRights: any[]) => async (req: any, res: any, next: any) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

