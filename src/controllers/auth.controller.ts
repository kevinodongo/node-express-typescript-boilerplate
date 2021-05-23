/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import httpStatus from "http-status";
import { Response, Request } from "express"
import { tokenService, userService, emailService, authService } from "../services";

/**
 * Register a new user
*/
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
}

/**
 * Create a new user
*/
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
}

/**
 * Forgot password
*/
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
}


/**
 * Reset password
*/
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
}


/**
 * Logout
*/
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
}


/**
 * Refresh token
*/
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
}