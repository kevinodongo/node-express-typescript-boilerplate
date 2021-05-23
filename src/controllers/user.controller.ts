import httpStatus from "http-status";
import { Response, Request } from "express"
import { userService } from "../services";
import ApiError from '../utils/ApiError';

/**
 * Update a user
*/
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
}

/**
 * Find one user
*/
export const findOneUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found', false, '');
  }
  res.send(user);
}

/**
 * Find all user
*/
export const findAllUsers = async (req: Request, res: Response): Promise<void> => {
  const filter: any = ''
  const options: any = ''
  const result = await userService.queryUsers(filter, options);
  res.send(result);
}

/**
 * update a user
*/
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user)
}

/**
 * Delete a user
*/
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
}

